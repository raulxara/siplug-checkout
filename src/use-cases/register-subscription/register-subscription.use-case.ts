import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { FindSubscriptionPlanByUniqueIdDtoIn } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in';
import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';

import { CreateSubscriptionDtoIn } from '../../modules/subscriptions/services/create-subscription/dtos/create-subscription.dto-in';
import { CreateSubscriptionService } from '../../modules/subscriptions/services/create-subscription/create-subscription.service';
import { FindSubscriptionByExternalReferenceAndOfficeIdDtoIn } from '../../modules/subscriptions/services/find-subscription-by-external-reference-and-office-id/dtos/find-subscription-by-external-reference-and-office-id.dto-in';
import { FindSubscriptionByExternalReferenceAndOfficeIdService } from '../../modules/subscriptions/services/find-subscription-by-external-reference-and-office-id/find-subscription-by-external-reference-and-office-id.service';

import { RegisterSubscriptionDtoIn } from './dtos/register-subscription.dto-in';
import { RegisterSubscriptionDtoOut } from './dtos/register-subscription.dto-out';

@Injectable()
export class RegisterSubscriptionUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService,

    private readonly findSubscriptionByExternalReferenceAndOfficeIdService: FindSubscriptionByExternalReferenceAndOfficeIdService,
    private readonly createSubscriptionService: CreateSubscriptionService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: RegisterSubscriptionDtoIn,
  ): Promise<RegisterSubscriptionDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerSubscription',
          requiredEntity: 'subscriptions',
        }),
      );

      this.validateStatus(dtoIn.status);
      this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
      this.assertNoSensitiveFields(dtoIn.config, 'config');

      const subscriptionPlanDtoOut =
        await this.findSubscriptionPlanByUniqueIdService.exec(
          new FindSubscriptionPlanByUniqueIdDtoIn(
            dtoIn.subscriptionPlanId,
          ),
        );

      const subscriptionPlan = subscriptionPlanDtoOut.subscriptionPlan;

      if (subscriptionPlan.status !== 'active') {
        throw new Error('subscription plan is not active');
      }

      if (subscriptionPlan.officeId !== dtoIn.officeId) {
        throw new Error('subscription plan does not belong to office');
      }

      if (subscriptionPlan.clientId !== dtoIn.clientId) {
        throw new Error('subscription plan does not belong to client');
      }

      if (dtoIn.externalReference !== null) {
        const existingSubscriptionDtoOut =
          await this.findSubscriptionByExternalReferenceAndOfficeIdService.exec(
            new FindSubscriptionByExternalReferenceAndOfficeIdDtoIn({
              externalReference: dtoIn.externalReference,
              officeId: dtoIn.officeId,
            }),
          );

        if (existingSubscriptionDtoOut.subscription !== null) {
          throw new Error(
            'subscription externalReference already exists for this office',
          );
        }
      }

      const amount = dtoIn.amount ?? subscriptionPlan.amount;
      const currency = dtoIn.currency ?? subscriptionPlan.currency;

      const nextBillingAt =
        dtoIn.nextBillingAt ??
        this.resolveInitialNextBillingAt(subscriptionPlan.trialDays);

      const createDtoOut = await this.createSubscriptionService.exec(
        new CreateSubscriptionDtoIn(
          dtoIn.officeId,
          dtoIn.clientId,

          dtoIn.subscriptionPlanId,
          dtoIn.paymentCustomerId,

          dtoIn.gatewayId ?? subscriptionPlan.gatewayId,
          dtoIn.apiCredentialId ?? subscriptionPlan.apiCredentialId,

          null,
          dtoIn.externalReference,

          amount,
          currency,

          0,

          nextBillingAt,
          null,
          null,
          null,

          {
            ...(dtoIn.metadata ?? {}),
            source: 'RegisterSubscriptionUseCase',
          },
          {
            ...(dtoIn.config ?? {}),
            subscriptionPlanSnapshot: {
              id: subscriptionPlan._id,
              name: subscriptionPlan.name,
              slug: subscriptionPlan.slug,
              billingInterval: subscriptionPlan.billingInterval,
              billingIntervalCount: subscriptionPlan.billingIntervalCount,
              amount: subscriptionPlan.amount,
              currency: subscriptionPlan.currency,
              trialDays: subscriptionPlan.trialDays,
              maxBillingCycles: subscriptionPlan.maxBillingCycles,
              paymentMethods: subscriptionPlan.paymentMethods,
            },
          },

          dtoIn.status,
        ),
      );

      return new RegisterSubscriptionDtoOut(createDtoOut.subscription);
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterSubscriptionUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            subscriptionPlanId: dtoIn.subscriptionPlanId,
            paymentCustomerId: dtoIn.paymentCustomerId,
            gatewayId: dtoIn.gatewayId,
            apiCredentialId: dtoIn.apiCredentialId,
            externalReference: dtoIn.externalReference,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register subscription use case';

      throw new Error(message);
    }
  }

  private resolveInitialNextBillingAt(trialDays: number | null): string {
    const date = new Date();

    if (trialDays !== null && trialDays > 0) {
      date.setDate(date.getDate() + trialDays);
    }

    return date.toISOString();
  }

  private validateStatus(status: string): void {
    const allowedStatuses = ['created', 'pending', 'active', 'inactive'];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`status must be one of: ${allowedStatuses.join(', ')}`);
    }
  }

  private assertNoSensitiveFields(
    data: Record<string, unknown> | null,
    path: string,
  ): void {
    if (data === null) {
      return;
    }

    const forbiddenKeys = [
      'token',
      'providerToken',
      'provider_token',
      'accessToken',
      'access_token',
      'authorization',
      'card',
      'cardNumber',
      'card_number',
      'cardToken',
      'card_token',
      'encryptedCard',
      'encrypted_card',
      'cvv',
      'securityCode',
      'security_code',
      'pan',
      'rawCard',
      'raw_card',
      'password',
      'secret',
      'clientSecret',
      'client_secret',
      'merchantKey',
      'merchant_key',
    ];

    for (const [key, value] of Object.entries(data)) {
      if (forbiddenKeys.includes(key)) {
        throw new Error(`forbidden sensitive field: ${path}.${key}`);
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.assertNoSensitiveFields(
          value as Record<string, unknown>,
          `${path}.${key}`,
        );
      }
    }
  }
}