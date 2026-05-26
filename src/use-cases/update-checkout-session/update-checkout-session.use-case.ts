import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import type { CheckoutSessionItemRow } from '../../modules/checkout-sessions/entities/checkout-session-items-repository.interface';
import { FindCheckoutSessionByUniqueIdDtoIn } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in';
import { FindCheckoutSessionByUniqueIdService } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';
import { UpdateCheckoutSessionItemDtoIn as UpdateCheckoutSessionItemServiceDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session-item/dtos/update-checkout-session-item.dto-in';
import { UpdateCheckoutSessionItemService } from '../../modules/checkout-sessions/services/update-checkout-session-item/update-checkout-session-item.service';
import { UpdateCheckoutSessionDtoIn as UpdateCheckoutSessionServiceDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';

import { FindGatewayByUniqueIdDtoIn } from '../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPaymentCustomerByUniqueIdDtoIn } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import {
  UpdateCheckoutSessionDtoIn,
  UpdateCheckoutSessionItemInput,
} from './dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionDtoOut } from './dtos/update-checkout-session.dto-out';

@Injectable()
export class UpdateCheckoutSessionUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findCheckoutSessionByUniqueIdService: FindCheckoutSessionByUniqueIdService,
    private readonly getAllCheckoutSessionItemsByCheckoutSessionIdService: GetAllCheckoutSessionItemsByCheckoutSessionIdService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService,
    private readonly findGatewayByUniqueIdService: FindGatewayByUniqueIdService,
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly updateCheckoutSessionService: UpdateCheckoutSessionService,
    private readonly updateCheckoutSessionItemService: UpdateCheckoutSessionItemService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: UpdateCheckoutSessionDtoIn,
  ): Promise<UpdateCheckoutSessionDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'updateCheckoutSession',
          requiredEntity: 'checkout_sessions',
        }),
      );

      const currentSessionDtoOut =
        await this.findCheckoutSessionByUniqueIdService.exec(
          new FindCheckoutSessionByUniqueIdDtoIn(dtoIn.checkoutSessionId),
        );

      const currentSession = currentSessionDtoOut.checkoutSession;

      const effectiveOfficeId = dtoIn.officeId ?? currentSession.officeId;
      const effectiveClientId = dtoIn.clientId ?? currentSession.clientId;
      const effectivePaymentCustomerId =
        dtoIn.paymentCustomerId ?? currentSession.paymentCustomerId;
      const effectiveGatewayId = dtoIn.gatewayId ?? currentSession.gatewayId;
      const effectiveApiCredentialId =
        dtoIn.apiCredentialId ?? currentSession.apiCredentialId;
      const effectivePaymentType =
        dtoIn.paymentType ?? currentSession.paymentType;
      const effectiveAmount = dtoIn.amount ?? currentSession.amount;

      this.validatePaymentType(effectivePaymentType);

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(effectiveOfficeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const clientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(effectiveClientId),
      );

      if (clientDtoOut.client.status !== 'active') {
        throw new Error('client is not active');
      }

      if (clientDtoOut.client.officeId !== effectiveOfficeId) {
        throw new Error('client does not belong to office');
      }

      if (effectivePaymentCustomerId !== null) {
        const paymentCustomerDtoOut =
          await this.findPaymentCustomerByUniqueIdService.exec(
            new FindPaymentCustomerByUniqueIdDtoIn(effectivePaymentCustomerId),
          );

        const paymentCustomer = paymentCustomerDtoOut.paymentCustomer;

        if (paymentCustomer.status !== 'active') {
          throw new Error('payment customer is not active');
        }

        if (paymentCustomer.officeId !== effectiveOfficeId) {
          throw new Error('payment customer does not belong to office');
        }

        if (paymentCustomer.clientId !== effectiveClientId) {
          throw new Error('payment customer does not belong to client');
        }
      }

      const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(
        new FindGatewayByUniqueIdDtoIn(effectiveGatewayId),
      );

      const gateway = gatewayDtoOut.gateway;

      if (gateway.status !== 'active') {
        throw new Error('gateway is not active');
      }

      if (effectiveApiCredentialId !== null) {
        const apiCredentialDtoOut =
          await this.findApiCredentialByUniqueIdService.exec(
            new FindApiCredentialByUniqueIdDtoIn(effectiveApiCredentialId),
          );

        const apiCredential = apiCredentialDtoOut.apiCredential;

        if (apiCredential.status !== 'active') {
          throw new Error('api credential is not active');
        }

        if (
          apiCredential.gatewayId !== null &&
          apiCredential.gatewayId !== effectiveGatewayId
        ) {
          throw new Error('api credential does not belong to gateway');
        }
      }

      this.validateGatewayCapabilities({
        paymentType: effectivePaymentType,
        gatewayConfig: gateway.config,
      });

      const currentItemsDtoOut =
        await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(
          new GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(
            currentSession._id,
          ),
        );

      this.validateFinalItemsTotal({
        effectiveAmount,
        currentItems: currentItemsDtoOut.items,
        itemUpdates: dtoIn.items,
      });

      const updatedSessionDtoOut =
        await this.updateCheckoutSessionService.exec(
          new UpdateCheckoutSessionServiceDtoIn({
            _id: dtoIn.checkoutSessionId,

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

            metadata: dtoIn.metadata,
            config: dtoIn.config,

            status: dtoIn.status,
            source: dtoIn.source,
          }),
        );

      for (const item of dtoIn.items) {
        const currentItem = currentItemsDtoOut.items.find(
          (row) => row._id === item.checkoutSessionItemId,
        );

        if (!currentItem) {
          throw new Error('checkout session item not found in current session');
        }

        const quantity = item.quantity ?? currentItem.quantity;
        const unitAmount = item.unitAmount ?? currentItem.unitAmount;

        const totalAmount =
          item.totalAmount ??
          (item.quantity !== undefined || item.unitAmount !== undefined
            ? quantity * unitAmount
            : null);

        await this.updateCheckoutSessionItemService.exec(
          new UpdateCheckoutSessionItemServiceDtoIn({
            _id: item.checkoutSessionItemId,
            checkoutSessionId: null,
            itemRef: item.itemRef ?? null,
            itemType: item.itemType ?? null,
            name: item.name ?? null,
            description: item.description ?? null,
            quantity: item.quantity ?? null,
            unitAmount: item.unitAmount ?? null,
            totalAmount,
            metadata: item.metadata ?? null,
            config: item.config ?? null,
            status: item.status ?? null,
            source: dtoIn.source,
          }),
        );
      }

      const updatedItemsDtoOut =
        await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(
          new GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(
            currentSession._id,
          ),
        );

      return new UpdateCheckoutSessionDtoOut(
        updatedSessionDtoOut.checkoutSession,
        updatedItemsDtoOut.items,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdateCheckoutSessionUseCase',
          error,
          appFile: __filename,
          context: {
            checkoutSessionId: dtoIn.checkoutSessionId,
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            paymentCustomerId: dtoIn.paymentCustomerId,
            gatewayId: dtoIn.gatewayId,
            apiCredentialId: dtoIn.apiCredentialId,
            paymentType: dtoIn.paymentType,
            amount: dtoIn.amount,
            currency: dtoIn.currency,
            itemsToUpdateTotal: dtoIn.items.length,
            status: dtoIn.status,
            source: dtoIn.source,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update checkout session use case';

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

  private validateFinalItemsTotal(params: {
    effectiveAmount: number;
    currentItems: CheckoutSessionItemRow[];
    itemUpdates: UpdateCheckoutSessionItemInput[];
  }): void {
    if (params.currentItems.length === 0) {
      throw new Error('checkout session must have at least one item');
    }

    const simulatedItemsById = new Map<string, CheckoutSessionItemRow>();

    for (const item of params.currentItems) {
      simulatedItemsById.set(item._id, { ...item });
    }

    for (const update of params.itemUpdates) {
      const currentItem = simulatedItemsById.get(update.checkoutSessionItemId);

      if (!currentItem) {
        throw new Error('checkout session item not found in current session');
      }

      const quantity = update.quantity ?? currentItem.quantity;
      const unitAmount = update.unitAmount ?? currentItem.unitAmount;

      const totalAmount =
        update.totalAmount ??
        (update.quantity !== undefined || update.unitAmount !== undefined
          ? quantity * unitAmount
          : currentItem.totalAmount);

      simulatedItemsById.set(update.checkoutSessionItemId, {
        ...currentItem,
        itemRef: update.itemRef ?? currentItem.itemRef,
        itemType: update.itemType ?? currentItem.itemType,
        name: update.name ?? currentItem.name,
        description: update.description ?? currentItem.description,
        quantity,
        unitAmount,
        totalAmount,
        metadata: update.metadata ?? currentItem.metadata,
        config: update.config ?? currentItem.config,
        status: update.status ?? currentItem.status,
      });
    }

    const calculatedTotal = Array.from(simulatedItemsById.values())
      .filter((item) => item.status === 'active')
      .reduce((total, item) => total + item.totalAmount, 0);

    if (calculatedTotal !== params.effectiveAmount) {
      throw new Error('checkout session amount does not match active items total');
    }
  }
}
