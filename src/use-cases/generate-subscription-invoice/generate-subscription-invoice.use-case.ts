import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { CreateSubscriptionCycleDtoIn } from '../../modules/subscription-cycles/services/create-subscription-cycle/dtos/create-subscription-cycle.dto-in';
import { CreateSubscriptionCycleService } from '../../modules/subscription-cycles/services/create-subscription-cycle/create-subscription-cycle.service';
import { CreateSubscriptionInvoiceDtoIn } from '../../modules/subscription-invoices/services/create-subscription-invoice/dtos/create-subscription-invoice.dto-in';
import { CreateSubscriptionInvoiceService } from '../../modules/subscription-invoices/services/create-subscription-invoice/create-subscription-invoice.service';
import { FindSubscriptionPlanByUniqueIdDtoIn } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in';
import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { FindSubscriptionByUniqueIdDtoIn } from '../../modules/subscriptions/services/find-subscription-by-unique-id/dtos/find-subscription-by-unique-id.dto-in';
import { FindSubscriptionByUniqueIdService } from '../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { UpdateSubscriptionDtoIn } from '../../modules/subscriptions/services/update-subscription/dtos/update-subscription.dto-in';
import { UpdateSubscriptionService } from '../../modules/subscriptions/services/update-subscription/update-subscription.service';

import { GenerateSubscriptionInvoiceDtoIn } from './dtos/generate-subscription-invoice.dto-in';
import { GenerateSubscriptionInvoiceDtoOut } from './dtos/generate-subscription-invoice.dto-out';

@Injectable()
export class GenerateSubscriptionInvoiceUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findSubscriptionByUniqueIdService: FindSubscriptionByUniqueIdService,
    private readonly findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService,

    private readonly createSubscriptionCycleService: CreateSubscriptionCycleService,
    private readonly createSubscriptionInvoiceService: CreateSubscriptionInvoiceService,
    private readonly updateSubscriptionService: UpdateSubscriptionService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GenerateSubscriptionInvoiceDtoIn,
  ): Promise<GenerateSubscriptionInvoiceDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'generateSubscriptionInvoice',
          requiredEntity: 'subscription_invoices',
        }),
      );

      const subscriptionDtoOut =
        await this.findSubscriptionByUniqueIdService.exec(
          new FindSubscriptionByUniqueIdDtoIn(dtoIn.subscriptionId),
        );

      const subscription = subscriptionDtoOut.subscription;

      if (!['created', 'pending', 'active'].includes(subscription.status)) {
        throw new Error(
          `subscription status does not allow invoice generation: ${subscription.status}`,
        );
      }

      if (subscription.subscriptionPlanId === null) {
        throw new Error('subscriptionPlanId is required to generate invoice');
      }

      const subscriptionPlanDtoOut =
        await this.findSubscriptionPlanByUniqueIdService.exec(
          new FindSubscriptionPlanByUniqueIdDtoIn(
            subscription.subscriptionPlanId,
          ),
        );

      const subscriptionPlan = subscriptionPlanDtoOut.subscriptionPlan;

      const nextCycleNumber = subscription.currentCycle + 1;

      if (
        subscriptionPlan.maxBillingCycles !== null &&
        nextCycleNumber > subscriptionPlan.maxBillingCycles &&
        !dtoIn.force
      ) {
        throw new Error('subscription has reached max billing cycles');
      }

      const scheduledAt = dtoIn.scheduledAt ?? subscription.nextBillingAt ?? new Date().toISOString();
      const periodStart = scheduledAt;
      const periodEnd = this.calculatePeriodEnd(
        scheduledAt,
        subscriptionPlan.billingInterval,
        subscriptionPlan.billingIntervalCount,
      );

      const dueAt = dtoIn.dueAt ?? scheduledAt;

      const subscriptionCycleDtoOut =
        await this.createSubscriptionCycleService.exec(
          new CreateSubscriptionCycleDtoIn(
            subscription._id,
            nextCycleNumber,

            subscription.amount,
            subscription.currency,

            periodStart,
            periodEnd,
            scheduledAt,
            null,

            {
              source: 'GenerateSubscriptionInvoiceUseCase',
              subscriptionPlanId: subscriptionPlan._id,
            },
            {
              billingInterval: subscriptionPlan.billingInterval,
              billingIntervalCount: subscriptionPlan.billingIntervalCount,
            },

            'scheduled',
          ),
        );

      const invoiceNumber = this.buildInvoiceNumber(
        subscription._id,
        nextCycleNumber,
      );

      const subscriptionInvoiceDtoOut =
        await this.createSubscriptionInvoiceService.exec(
          new CreateSubscriptionInvoiceDtoIn(
            subscription._id,
            subscriptionCycleDtoOut.subscriptionCycle._id,
            null,

            invoiceNumber,

            subscription.amount,
            subscription.currency,

            dueAt,
            null,

            1,
            invoiceNumber,
            null,
            null,

            {
              source: 'GenerateSubscriptionInvoiceUseCase',
              subscriptionPlanId: subscriptionPlan._id,
              cycleNumber: nextCycleNumber,
            },
            {
              chargeStrategy: 'manual_first',
              paymentCustomerId: subscription.paymentCustomerId,
              gatewayId: subscription.gatewayId,
              apiCredentialId: subscription.apiCredentialId,
            },

            'created',
          ),
        );

      const updatedSubscriptionDtoOut =
        await this.updateSubscriptionService.exec(
          new UpdateSubscriptionDtoIn(
            subscription._id,

            nextCycleNumber,
            periodEnd,
            subscription.startedAt ?? this.nowAsIso(),
            null,
            null,

            subscription.metadata,
            subscription.config,

            subscription.status === 'created' ? 'active' : subscription.status,
            'GenerateSubscriptionInvoiceUseCase',
          ),
        );

      return new GenerateSubscriptionInvoiceDtoOut(
        updatedSubscriptionDtoOut.subscription,
        subscriptionCycleDtoOut.subscriptionCycle,
        subscriptionInvoiceDtoOut.subscriptionInvoice,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GenerateSubscriptionInvoiceUseCase',
          error,
          appFile: __filename,
          context: {
            subscriptionId: dtoIn.subscriptionId,
            scheduledAt: dtoIn.scheduledAt,
            dueAt: dtoIn.dueAt,
            force: dtoIn.force,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on generate subscription invoice use case';

      throw new Error(message);
    }
  }

  private calculatePeriodEnd(
    startIso: string,
    interval: string,
    intervalCount: number,
  ): string {
    const date = new Date(startIso);

    if (interval === 'day') {
      date.setDate(date.getDate() + intervalCount);
      return date.toISOString();
    }

    if (interval === 'week') {
      date.setDate(date.getDate() + intervalCount * 7);
      return date.toISOString();
    }

    if (interval === 'month') {
      date.setMonth(date.getMonth() + intervalCount);
      return date.toISOString();
    }

    if (interval === 'year') {
      date.setFullYear(date.getFullYear() + intervalCount);
      return date.toISOString();
    }

    throw new Error(`unsupported subscription interval: ${interval}`);
  }

  private buildInvoiceNumber(
    subscriptionId: string,
    cycleNumber: number,
  ): string {
    const cleanSubscriptionId = subscriptionId.replace(/[^a-zA-Z0-9]/g, '');

    return `INV-${cleanSubscriptionId.slice(0, 12)}-${String(cycleNumber).padStart(6, '0')}`;
  }

  private nowAsIso(): string {
    return new Date().toISOString();
  }
}