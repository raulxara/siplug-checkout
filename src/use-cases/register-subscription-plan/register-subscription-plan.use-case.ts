import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { CreateSubscriptionPlanDtoIn } from '../../modules/subscription-plans/services/create-subscription-plan/dtos/create-subscription-plan.dto-in';
import { CreateSubscriptionPlanService } from '../../modules/subscription-plans/services/create-subscription-plan/create-subscription-plan.service';
import { FindSubscriptionPlanBySlugAndOfficeIdDtoIn } from '../../modules/subscription-plans/services/find-subscription-plan-by-slug-and-office-id/dtos/find-subscription-plan-by-slug-and-office-id.dto-in';
import { FindSubscriptionPlanBySlugAndOfficeIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-slug-and-office-id/find-subscription-plan-by-slug-and-office-id.service';

import { RegisterSubscriptionPlanDtoIn } from './dtos/register-subscription-plan.dto-in';
import { RegisterSubscriptionPlanDtoOut } from './dtos/register-subscription-plan.dto-out';

@Injectable()
export class RegisterSubscriptionPlanUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,

    private readonly findSubscriptionPlanBySlugAndOfficeIdService: FindSubscriptionPlanBySlugAndOfficeIdService,
    private readonly createSubscriptionPlanService: CreateSubscriptionPlanService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: RegisterSubscriptionPlanDtoIn,
  ): Promise<RegisterSubscriptionPlanDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerSubscriptionPlan',
          requiredEntity: 'subscription_plans',
        }),
      );

      this.validateBillingInterval(dtoIn.billingInterval);
      this.validateStatus(dtoIn.status);
      this.validateCurrency(dtoIn.currency);
      this.validatePaymentMethods(dtoIn.paymentMethods);
      this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
      this.assertNoSensitiveFields(dtoIn.config, 'config');

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const clientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(dtoIn.clientId),
      );

      if (clientDtoOut.client.status !== 'active') {
        throw new Error('client is not active');
      }

      if (clientDtoOut.client.officeId !== dtoIn.officeId) {
        throw new Error('client does not belong to office');
      }

      const existingSubscriptionPlanDtoOut =
        await this.findSubscriptionPlanBySlugAndOfficeIdService.exec(
          new FindSubscriptionPlanBySlugAndOfficeIdDtoIn({
            slug: dtoIn.slug,
            officeId: dtoIn.officeId,
          }),
        );

      if (existingSubscriptionPlanDtoOut.subscriptionPlan !== null) {
        throw new Error('subscription plan slug already exists for this office');
      }

      const createDtoOut = await this.createSubscriptionPlanService.exec(
        new CreateSubscriptionPlanDtoIn(
          dtoIn.officeId,
          dtoIn.clientId,

          dtoIn.gatewayId,
          dtoIn.apiCredentialId,
          null,

          dtoIn.name,
          dtoIn.slug,
          dtoIn.description,

          dtoIn.billingInterval,
          dtoIn.billingIntervalCount,

          dtoIn.amount,
          dtoIn.currency,

          dtoIn.trialDays,
          dtoIn.maxBillingCycles,

          dtoIn.paymentMethods,
          {
            ...(dtoIn.metadata ?? {}),
            source: 'RegisterSubscriptionPlanUseCase',
          },
          dtoIn.config,

          dtoIn.status,
        ),
      );

      return new RegisterSubscriptionPlanDtoOut(
        createDtoOut.subscriptionPlan,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterSubscriptionPlanUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            gatewayId: dtoIn.gatewayId,
            apiCredentialId: dtoIn.apiCredentialId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            billingInterval: dtoIn.billingInterval,
            billingIntervalCount: dtoIn.billingIntervalCount,
            amount: dtoIn.amount,
            currency: dtoIn.currency,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register subscription plan use case';

      throw new Error(message);
    }
  }

  private validateBillingInterval(billingInterval: string): void {
    const allowedIntervals = ['day', 'week', 'month', 'year'];

    if (!allowedIntervals.includes(billingInterval)) {
      throw new Error(
        `billingInterval must be one of: ${allowedIntervals.join(', ')}`,
      );
    }
  }

  private validateStatus(status: string): void {
    const allowedStatuses = ['active', 'inactive', 'draft'];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`status must be one of: ${allowedStatuses.join(', ')}`);
    }
  }

  private validateCurrency(currency: string): void {
    const allowedCurrencies = ['BRL', 'USD'];

    if (!allowedCurrencies.includes(currency)) {
      throw new Error(`currency must be one of: ${allowedCurrencies.join(', ')}`);
    }
  }

  private validatePaymentMethods(paymentMethods: string[] | null): void {
    if (paymentMethods === null) {
      return;
    }

    const allowedPaymentMethods = [
      'credit_card',
      'debit_card',
      'pix',
      'boleto',
      'payment_link',
    ];

    for (const paymentMethod of paymentMethods) {
      if (!allowedPaymentMethods.includes(paymentMethod)) {
        throw new Error(
          `paymentMethods contains invalid method: ${paymentMethod}`,
        );
      }
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
