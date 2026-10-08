import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { RegisterCheckoutSessionUseCase } from '../register-checkout-session/register-checkout-session.use-case';
import { RegisterCheckoutSessionDtoIn } from '../register-checkout-session/dtos/register-checkout-session.dto-in';
import { RegisterSubscriptionPlanUseCase } from '../register-subscription-plan/register-subscription-plan.use-case';
import { RegisterSubscriptionPlanDtoIn } from '../register-subscription-plan/dtos/register-subscription-plan.dto-in';
import { ProcessPaymentUseCase } from '../process-payment/process-payment.use-case';
import { ProcessPaymentDtoIn } from '../process-payment/dtos/process-payment.dto-in';
import { ProcessRecurringPaymentUseCase } from '../process-recurring-payment/process-recurring-payment.use-case';
import { ProcessRecurringPaymentDtoIn } from '../process-recurring-payment/dtos/process-recurring-payment.dto-in';
import { HostedOrdersRepository } from '../../modules/hosted-orders/repositories/hosted-orders.repository';
import { HostedOrderRequest } from './dtos/hosted-order.request';
@Injectable()
export class HostedOrdersUseCase {
  constructor(
    private readonly auth: GetAuthContextUseCase,
    private readonly orders: HostedOrdersRepository,
    private readonly sessions: RegisterCheckoutSessionUseCase,
    private readonly plans: RegisterSubscriptionPlanUseCase,
    private readonly payments: ProcessPaymentUseCase,
    private readonly recurring: ProcessRecurringPaymentUseCase,
  ) {}
  async status(token: string, orderId: string) {
    const actor = await this.auth.exec(token);
    return this.orders.result(actor.officeId, actor.clientId, orderId);
  }
  async start(token: string, input: HostedOrderRequest) {
    const actor = await this.auth.exec(token);
    if (
      input.items.some((i) => i.totalAmount !== i.quantity * i.unitAmount) ||
      input.items.reduce((n, i) => n + i.totalAmount, 0) !== input.amount
    )
      throw new BadRequestException('Valores inconsistentes.');
    if ((input.discount ?? 0) > 0 && !input.cuponId)
      throw new BadRequestException('Cupom obrigatório para desconto.');
    if (input.amount + (input.discount ?? 0) > 999999999)
      throw new BadRequestException('Valor fora do limite.');
    if (
      input.cuponId &&
      input.paymentType === 'recurring' &&
      !input.couponRecurrence
    )
      throw new BadRequestException('COUPON_RECURRENCE_REQUIRED');
    const hash = createHash('sha256')
      .update(JSON.stringify(input))
      .digest('hex');
    const lease = await this.orders.reserve(
      actor.officeId,
      actor.clientId,
      input.orderId,
      hash,
    );
    try {
      let session = await this.orders.session(
        actor.officeId,
        actor.clientId,
        input.orderId,
      );
      if (!session) {
        const gateway = await this.orders.gateway(
          actor.officeId,
          actor.clientId,
          input.paymentType,
        );
        if (
          input.cuponId &&
          input.couponRecurrence === 'first_payment' &&
          input.paymentType === 'recurring' &&
          gateway.gateway?.provider !== 'mercadopago'
        )
          throw new BadRequestException('COUPON_FIRST_PAYMENT_UNSUPPORTED');
        let subscriptionPlanId: string | undefined;
        if (input.paymentType === 'recurring') {
          const slug = 'pedido-' + input.orderId;
          const existing = await this.orders.plan(actor.officeId, slug);
          subscriptionPlanId = existing?.unique_id;
          if (!subscriptionPlanId) {
            const result = await this.plans.exec(
              new RegisterSubscriptionPlanDtoIn({
                token,
                officeId: actor.officeId,
                clientId: actor.clientId,
                gatewayId: gateway.gateway_id,
                apiCredentialId: gateway.unique_id,
                name: input.items[0].name,
                slug,
                amount: input.amount,
                currency: 'BRL',
                billingInterval: input.interval,
                billingIntervalCount: input.intervalCount,
                paymentMethods: ['payment_link'],
                metadata: { orderId: input.orderId },
              }),
            );
            subscriptionPlanId = result.subscriptionPlan._id;
          }
        }
        await this.sessions.exec(
          new RegisterCheckoutSessionDtoIn({
            token,
            officeId: actor.officeId,
            clientId: actor.clientId,
            gatewayId: gateway.gateway_id,
            apiCredentialId: gateway.unique_id,
            externalReference: input.orderId,
            idempotencyKey: 'hosted-session-' + input.orderId,
            paymentType: input.paymentType,
            amount: input.amount,
            currency: 'BRL',
            items: input.items,
            config: {
              ...(subscriptionPlanId
                ? { subscription: { subscriptionPlanId } }
                : {}),
              ...(input.cuponId
                ? {
                    cuponId: input.cuponId,
                    discount: input.discount ?? 0,
                    couponRecurrence: input.couponRecurrence ?? null,
                    ...(input.paymentType === 'recurring' &&
                    input.couponRecurrence === 'first_payment'
                      ? {
                          couponAdjustmentStatus: 'pending',
                          renewalAmount: input.amount + (input.discount ?? 0),
                        }
                      : {}),
                  }
                : {}),
            },
            metadata: { orderId: input.orderId },
          }),
        );
        session = await this.orders.session(
          actor.officeId,
          actor.clientId,
          input.orderId,
        );
      }
      if (
        !session ||
        session.items.length !== input.items.length ||
        session.items.reduce((n, i) => n + i.total_amount, 0) !== input.amount
      )
        throw new ConflictException(
          'Sessão incompleta. Conciliação necessária.',
        );
      const result = await this.orders.result(
        actor.officeId,
        actor.clientId,
        input.orderId,
      );
      // An uncertain provider dispatch must never create a second payment on retry.
      if (result.transactionId) return result;
      if (result.subscriptionId)
        throw new ConflictException(
          'Assinatura parcialmente criada. Conciliação necessária antes de repetir.',
        );
      const params = {
        token,
        checkoutSessionId: session.unique_id,
        paymentMethod: 'payment_link',
        payer: input.payer,
        gatewayId: session.gateway_id,
        apiCredentialId: session.api_credential_id,
      };
      if (input.paymentType === 'recurring')
        await this.recurring.exec(new ProcessRecurringPaymentDtoIn(params));
      else
        await this.payments.exec(
          new ProcessPaymentDtoIn({
            ...params,
            idempotencyKey: 'hosted-payment-' + input.orderId,
            externalReference: input.orderId,
          }),
        );
      return this.orders.result(actor.officeId, actor.clientId, input.orderId);
    } finally {
      await this.orders.release(lease);
    }
  }
}
