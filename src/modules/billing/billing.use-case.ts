import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID, createHash } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { GetAuthContextUseCase } from '../../use-cases/get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ProcessPaymentUseCase } from '../../use-cases/process-payment/process-payment.use-case';
import { ProcessPaymentDtoIn } from '../../use-cases/process-payment/dtos/process-payment.dto-in';
import { HostedOrdersRepository } from '../hosted-orders/repositories/hosted-orders.repository';
import { BillingRepository, obj } from './billing.repository';
import {
  BillingListDto,
  BillingIdentityDto,
  BillingCreateDto,
  BillingActionDto,
} from './billing.dto';
@Injectable()
export class BillingUseCase {
  constructor(
    private identity: GetAuthContextUseCase,
    private auth: ResolveActorAuthorizationService,
    private repo: BillingRepository,
    private payments: ProcessPaymentUseCase,
    private hosted: HostedOrdersRepository,
  ) {}
  private async actor(token: string, action = 'read') {
    await this.auth.exec(
      new ResolveActorAuthorizationDtoIn({
        token,
        requiredEntity: 'billing',
        requiredAction: action,
      }),
    );
    return this.identity.exec(token);
  }
  async list(t: string, d: BillingListDto) {
    const a = await this.actor(t);
    return this.repo.list(a.officeId, a.clientId, d);
  }
  async detail(t: string, d: BillingIdentityDto) {
    const a = await this.actor(t);
    return this.repo.detail(a.officeId, a.clientId, d.kind, d.id);
  }
  async customers(t: string, q: string) {
    const a = await this.actor(t, 'create');
    return this.repo.customers(a.officeId, a.clientId, q);
  }
  async customer(t: string, id: string) {
    const a = await this.actor(t, 'create');
    const c = await this.repo.db.paymentCustomer.findFirst({
      where: {
        unique_id: id,
        office_id: a.officeId,
        client_id: a.clientId,
        status: 'active',
      },
    });
    if (!c) throw new NotFoundException();
    return {
      name: c.name,
      email: c.email,
      documentType: c.document_type,
      documentValue: c.document_value,
      phoneNumber: c.phone,
      address: c.billing_address,
    };
  }
  async create(t: string, d: BillingCreateDto) {
    const a = await this.actor(t, 'create');
    if (!d.description.trim() || new Date(d.dueAt) < new Date())
      throw new BadRequestException('BILLING_INVALID_DUE_DATE');
    const customer = await this.repo.db.paymentCustomer.findFirst({
      where: {
        unique_id: d.customerId,
        office_id: a.officeId,
        client_id: a.clientId,
        status: 'active',
      },
    });
    if (!customer) throw new NotFoundException();
    const hash = createHash('sha256').update(JSON.stringify(d)).digest('hex');
    const existing = await this.repo.db.checkoutSession.findUnique({
      where: { unique_id: d.requestKey },
    });
    if (existing) {
      if (
        existing.office_id !== a.officeId ||
        existing.client_id !== a.clientId ||
        obj(obj(existing.config).billing).requestHash !== hash
      )
        throw new ConflictException();
      return this.repo.detail(
        a.officeId,
        a.clientId,
        'session',
        existing.unique_id,
      );
    }
    try {
      await this.repo.db.checkoutSession.create({
        data: {
          unique_id: d.requestKey,
          office_id: a.officeId,
          client_id: a.clientId,
          payment_customer_id: d.customerId,
          payment_type: 'one_time',
          amount: d.amount,
          currency: 'BRL',
          description: d.description.trim(),
          external_reference: d.requestKey,
          status: 'draft',
          config: {
            billing: {
              version: 1,
              dueAt: new Date(d.dueAt).toISOString(),
              received: 0,
              requestHash: hash,
              history: [
                {
                  action: 'created',
                  at: new Date().toISOString(),
                  actor: a.userCustomerId,
                },
              ],
            },
          },
          items: {
            create: {
              unique_id: randomUUID(),
              item_ref: randomUUID(),
              name: d.description.trim(),
              quantity: 1,
              unit_amount: d.amount,
              total_amount: d.amount,
            },
          },
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      )
        return this.create(t, d);
      throw e;
    }
    return this.repo.detail(a.officeId, a.clientId, 'session', d.requestKey);
  }
  async act(t: string, d: BillingActionDto) {
    const a = await this.actor(t, d.action === 'refresh' ? 'read' : d.action);
    if (d.action === 'refresh')
      return this.repo.detail(a.officeId, a.clientId, d.kind, d.id);
    if (d.kind !== 'session')
      throw new ConflictException('BILLING_GATEWAY_MANAGED');
    const gateway =
      d.action === 'issue'
        ? await this.hosted.gateway(a.officeId, a.clientId, 'one_time')
        : null;
    const session = await this.repo.db.$transaction(async (tx) => {
      await tx.$queryRaw(
        Prisma.sql`SELECT _id FROM checkout_sessions WHERE _id=${d.id} AND office_id=${a.officeId} AND client_id=${a.clientId} FOR UPDATE`,
      );
      const s = await tx.checkoutSession.findFirst({
        where: {
          unique_id: d.id,
          office_id: a.officeId,
          client_id: a.clientId,
        },
        include: { payment_transactions: true, payment_customer: true },
      });
      if (!s) throw new NotFoundException();
      const config = obj(s.config),
        b = obj(config.billing),
        history = Array.isArray(b.history) ? b.history : [];
      const hash = createHash('sha256').update(JSON.stringify(d)).digest('hex');
      const previous = [...history]
        .reverse()
        .find((r: any) => r.requestKey === d.requestKey);
      if (previous) {
        if (previous.hash !== hash)
          throw new ConflictException('BILLING_REQUEST_CONFLICT');
        if (!previous.retryable) return null;
      }
      if (
        b.version !== 1 ||
        s.payment_transactions.length ||
        b.issueStartedAt ||
        ['paid', 'canceled'].includes(s.status)
      )
        throw new ConflictException('BILLING_GATEWAY_MANAGED');
      const event: any = {
        action: d.action,
        at: new Date().toISOString(),
        actor: a.userCustomerId,
        requestKey: d.requestKey,
        hash,
      };
      let status = s.status;
      if (d.action === 'receive') {
        if (
          !d.amount ||
          !d.reason?.trim() ||
          !d.method ||
          !d.receivedAt ||
          new Date(d.receivedAt) > new Date() ||
          d.amount > s.amount - Number(b.received || 0)
        )
          throw new BadRequestException('BILLING_INVALID_RECEIPT');
        b.received = Number(b.received || 0) + d.amount;
        status = b.received === s.amount ? 'paid' : 'partial';
        Object.assign(event, {
          amount: d.amount,
          reason: d.reason,
          method: d.method,
          receivedAt: d.receivedAt,
        });
      } else if (d.action === 'cancel') {
        if (b.received || !d.reason?.trim())
          throw new BadRequestException('BILLING_INVALID_CANCELLATION');
        status = 'canceled';
        event.reason = d.reason;
      } else {
        if (
          b.received ||
          new Date(b.dueAt) <= new Date() ||
          !gateway ||
          !s.payment_customer?.email
        )
          throw new ConflictException('BILLING_CANNOT_ISSUE');
        b.issueStartedAt = new Date().toISOString();
        status = 'created';
      }
      b.history = [...history, event];
      return tx.checkoutSession.update({
        where: { id: s.id },
        data: {
          status,
          config: {
            ...config,
            ...(gateway
              ? {
                  environment:
                    obj(gateway.config).environment || gateway.environment,
                }
              : {}),
            billing: b,
          },
          ...(gateway
            ? {
                gateway_id: gateway.gateway_id,
                api_credential_id: gateway.unique_id,
                expires_at: new Date(b.dueAt),
              }
            : {}),
        },
        include: { payment_customer: true },
      });
    });
    if (d.action === 'issue' && session) {
      const c = session.payment_customer!;
      try {
        await this.payments.exec(
          new ProcessPaymentDtoIn({
            token: t,
            checkoutSessionId: session.unique_id,
            paymentMethod: 'payment_link',
            gatewayId: session.gateway_id,
            apiCredentialId: session.api_credential_id,
            idempotencyKey: 'invoice-' + session.unique_id,
            externalReference: session.external_reference,
            payer: {
              name: c.name,
              email: c.email,
              phone: c.phone,
              document: c.document_value,
              documentType: c.document_type,
              address: c.billing_address,
            },
          }),
        );
      } catch (error) {
        // ProcessPayment persists a transaction BEFORE dispatching to the provider.
        // Only release the draft if no dispatch could have taken place.
        await this.repo.db.$transaction(async (tx) => {
          await tx.$queryRaw(
            Prisma.sql`SELECT _id FROM checkout_sessions WHERE _id=${session.unique_id} FOR UPDATE`,
          );
          const current = await tx.checkoutSession.findUniqueOrThrow({
            where: { unique_id: session.unique_id },
            include: { payment_transactions: true },
          });
          if (current.payment_transactions.length) return;
          const config = obj(current.config),
            billing = obj(config.billing);
          delete billing.issueStartedAt;
          billing.history = (billing.history || []).map((e: any) =>
            e.requestKey === d.requestKey ? { ...e, retryable: true } : e,
          );
          billing.history.push({
            action: 'issue_failed',
            at: new Date().toISOString(),
            actor: a.userCustomerId,
          });
          await tx.checkoutSession.update({
            where: { id: current.id },
            data: { status: 'draft', config: { ...config, billing } },
          });
        });
        throw new ConflictException('BILLING_ISSUE_NOT_CONFIRMED');
      }
    }
    return this.repo.detail(a.officeId, a.clientId, d.kind, d.id);
  }
}
