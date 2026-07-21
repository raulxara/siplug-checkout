import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { CreateCheckoutSessionItemDtoIn } from '../../modules/checkout-sessions/services/create-checkout-session-item/dtos/create-checkout-session-item.dto-in';
import { CreateCheckoutSessionItemService } from '../../modules/checkout-sessions/services/create-checkout-session-item/create-checkout-session-item.service';
import { CreateCheckoutSessionDtoIn as CreateCheckoutSessionServiceDtoIn } from '../../modules/checkout-sessions/services/create-checkout-session/dtos/create-checkout-session.dto-in';
import { CreateCheckoutSessionService } from '../../modules/checkout-sessions/services/create-checkout-session/create-checkout-session.service';
import { UpdateCheckoutSessionDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';

import { FindGatewayByUniqueIdDtoIn } from '../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPaymentCustomerByUniqueIdDtoIn } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import type { CheckoutSessionItemRow } from '../../modules/checkout-sessions/entities/checkout-session-items-repository.interface';

import {
  RegisterCheckoutSessionDtoIn,
  RegisterCheckoutSessionItemDtoIn,
} from './dtos/register-checkout-session.dto-in';
import { RegisterCheckoutSessionDtoOut } from './dtos/register-checkout-session.dto-out';

@Injectable()
export class RegisterCheckoutSessionUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService,
    private readonly findGatewayByUniqueIdService: FindGatewayByUniqueIdService,
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly createCheckoutSessionService: CreateCheckoutSessionService,
    private readonly updateCheckoutSessionService: UpdateCheckoutSessionService,
    private readonly createCheckoutSessionItemService: CreateCheckoutSessionItemService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: RegisterCheckoutSessionDtoIn,
  ): Promise<RegisterCheckoutSessionDtoOut> {
    let createdCheckoutSessionId: string | null = null;

    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerCheckoutSession',
          requiredEntity: 'checkout_sessions',
        }),
      );

      this.validatePaymentType(dtoIn.paymentType);
      this.validateItemsTotal(dtoIn.amount, dtoIn.items);

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

      if (dtoIn.paymentCustomerId !== null) {
        const paymentCustomerDtoOut =
          await this.findPaymentCustomerByUniqueIdService.exec(
            new FindPaymentCustomerByUniqueIdDtoIn(dtoIn.paymentCustomerId),
          );

        const paymentCustomer = paymentCustomerDtoOut.paymentCustomer;

        if (paymentCustomer.status !== 'active') {
          throw new Error('payment customer is not active');
        }

        if (paymentCustomer.officeId !== dtoIn.officeId) {
          throw new Error('payment customer does not belong to office');
        }

        if (paymentCustomer.clientId !== dtoIn.clientId) {
          throw new Error('payment customer does not belong to client');
        }
      }

      let resolvedGateway:
        | {
            _id: string;
            slug: string;
            provider: string;
            config: Record<string, unknown> | null;
            status: string;
          }
        | null = null;

      if (dtoIn.gatewayId !== null) {
        const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(
          new FindGatewayByUniqueIdDtoIn(dtoIn.gatewayId),
        );

        resolvedGateway = gatewayDtoOut.gateway;

        if (resolvedGateway.status !== 'active') {
          throw new Error('gateway is not active');
        }
      }

      if (dtoIn.apiCredentialId !== null) {
        if (dtoIn.gatewayId === null) {
          throw new Error('gatewayId is required when apiCredentialId is provided');
        }

        const apiCredentialDtoOut =
          await this.findApiCredentialByUniqueIdService.exec(
            new FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId),
          );

        const apiCredential = apiCredentialDtoOut.apiCredential;

        if (apiCredential.status !== 'active') {
          throw new Error('api credential is not active');
        }

        if (
          apiCredential.gatewayId !== null &&
          apiCredential.gatewayId !== dtoIn.gatewayId
        ) {
          throw new Error('api credential does not belong to gateway');
        }
      }

      if (resolvedGateway !== null) {
        this.validateGatewayCapabilities({
          paymentType: dtoIn.paymentType,
          gatewayConfig: resolvedGateway.config,
        });
      }

      const checkoutSessionDtoOut =
        await this.createCheckoutSessionService.exec(
          new CreateCheckoutSessionServiceDtoIn({
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            paymentCustomerId: dtoIn.paymentCustomerId,
            gatewayId: dtoIn.gatewayId,
            apiCredentialId: dtoIn.apiCredentialId,

            code: dtoIn.code,
            externalReference: dtoIn.externalReference,
            idempotencyKey: dtoIn.idempotencyKey,

            paymentType: dtoIn.paymentType,
            amount: dtoIn.amount,
            currency: dtoIn.currency,
            description: dtoIn.description,

            successUrl: dtoIn.successUrl,
            cancelUrl: dtoIn.cancelUrl,
            expiresAt: dtoIn.expiresAt,

            metadata: {
              ...(dtoIn.metadata ?? {}),
              ...(resolvedGateway !== null
                ? {
                    gatewaySlug: resolvedGateway.slug,
                    gatewayProvider: resolvedGateway.provider,
                  }
                : {}),
              source: 'RegisterCheckoutSessionUseCase',
            },
            config: dtoIn.config,

            status: dtoIn.status,
          }),
        );

      createdCheckoutSessionId = checkoutSessionDtoOut._id;

      const createdItems: CheckoutSessionItemRow[] = [];

      for (const item of dtoIn.items) {
        const quantity = item.quantity ?? 1;
        const unitAmount = Number(item.unitAmount);
        const totalAmount = Number(item.totalAmount ?? quantity * unitAmount);

        const itemDtoOut = await this.createCheckoutSessionItemService.exec(
          new CreateCheckoutSessionItemDtoIn({
            checkoutSessionId: checkoutSessionDtoOut._id,
            itemRef: item.itemRef ?? null,
            itemType: item.itemType ?? null,
            name: item.name,
            description: item.description ?? null,
            quantity,
            unitAmount,
            totalAmount,
            metadata: item.metadata ?? null,
            config: item.config ?? null,
            status: item.status ?? 'active',
          }),
        );

        createdItems.push({
          id: itemDtoOut.id,
          _id: itemDtoOut._id,
          checkoutSessionId: itemDtoOut.checkoutSessionId,
          itemRef: itemDtoOut.itemRef,
          itemType: itemDtoOut.itemType,
          name: itemDtoOut.name,
          description: itemDtoOut.description,
          quantity: itemDtoOut.quantity,
          unitAmount: itemDtoOut.unitAmount,
          totalAmount: itemDtoOut.totalAmount,
          metadata: itemDtoOut.metadata,
          config: itemDtoOut.config,
          changesHistory: itemDtoOut.changesHistory,
          status: itemDtoOut.status,
          createdAt: itemDtoOut.createdAt,
          updatedAt: itemDtoOut.updatedAt,
        });
      }

      return new RegisterCheckoutSessionDtoOut(
        {
          id: checkoutSessionDtoOut.id,
          _id: checkoutSessionDtoOut._id,
          officeId: checkoutSessionDtoOut.officeId,
          clientId: checkoutSessionDtoOut.clientId,
          paymentCustomerId: checkoutSessionDtoOut.paymentCustomerId,
          gatewayId: checkoutSessionDtoOut.gatewayId,
          apiCredentialId: checkoutSessionDtoOut.apiCredentialId,
          code: checkoutSessionDtoOut.code,
          externalReference: checkoutSessionDtoOut.externalReference,
          idempotencyKey: checkoutSessionDtoOut.idempotencyKey,
          paymentType: checkoutSessionDtoOut.paymentType,
          amount: checkoutSessionDtoOut.amount,
          currency: checkoutSessionDtoOut.currency,
          description: checkoutSessionDtoOut.description,
          successUrl: checkoutSessionDtoOut.successUrl,
          cancelUrl: checkoutSessionDtoOut.cancelUrl,
          expiresAt: checkoutSessionDtoOut.expiresAt,
          metadata: checkoutSessionDtoOut.metadata,
          config: checkoutSessionDtoOut.config,
          changesHistory: checkoutSessionDtoOut.changesHistory,
          status: checkoutSessionDtoOut.status,
          createdAt: checkoutSessionDtoOut.createdAt,
          updatedAt: checkoutSessionDtoOut.updatedAt,
        },
        createdItems,
      );
    } catch (error) {
      if (createdCheckoutSessionId !== null) {
        await this.updateCheckoutSessionService.exec(
          new UpdateCheckoutSessionDtoIn({
            _id: createdCheckoutSessionId,
            status: 'failed',
            source: 'RegisterCheckoutSessionUseCase.rollback',
          }),
        );
      }

      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterCheckoutSessionUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            paymentCustomerId: dtoIn.paymentCustomerId,
            gatewayId: dtoIn.gatewayId,
            apiCredentialId: dtoIn.apiCredentialId,
            externalReference: dtoIn.externalReference,
            idempotencyKey: dtoIn.idempotencyKey,
            paymentType: dtoIn.paymentType,
            amount: dtoIn.amount,
            currency: dtoIn.currency,
            itemsTotal: dtoIn.items.length,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register checkout session use case';

      throw new Error(message);
    }
  }

  private validatePaymentType(paymentType: string): void {
    const allowedPaymentTypes = ['one_time', 'installment', 'recurring'];

    if (!allowedPaymentTypes.includes(paymentType)) {
      throw new Error(
        `paymentType must be one of: ${allowedPaymentTypes.join(', ')}`,
      );
    }
  }

  private validateItemsTotal(
    amount: number,
    items: RegisterCheckoutSessionItemDtoIn[],
  ): void {
    const calculatedTotal = items.reduce((total, item) => {
      const quantity = item.quantity ?? 1;
      const unitAmount = Number(item.unitAmount);
      const totalAmount = Number(item.totalAmount ?? quantity * unitAmount);

      return total + totalAmount;
    }, 0);

    if (calculatedTotal !== amount) {
      throw new Error('checkout session amount does not match items total');
    }
  }

  private validateGatewayCapabilities(params: {
    paymentType: string;
    gatewayConfig: Record<string, unknown> | null;
  }): void {
    const config = params.gatewayConfig ?? {};

    if (
      params.paymentType === 'one_time' &&
      config.supportsOneTimePayment === false
    ) {
      throw new Error('gateway does not support one time payment');
    }

    if (
      params.paymentType === 'installment' &&
      config.supportsInstallments === false
    ) {
      throw new Error('gateway does not support installments');
    }

    if (
      params.paymentType === 'recurring' &&
      config.supportsRecurringPayment === false
    ) {
      throw new Error('gateway does not support recurring payment');
    }
  }
}
