import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  CheckoutSessionRow,
  ICheckoutSessionsRepository,
} from '../../entities/checkout-sessions-repository.interface';
import { CHECKOUT_SESSIONS_REPOSITORY } from '../../tokens/checkout-sessions.tokens';
import { UpdateCheckoutSessionDtoIn } from './dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionDtoOut } from './dtos/update-checkout-session.dto-out';

@Injectable()
export class UpdateCheckoutSessionService {
  constructor(
    @Inject(CHECKOUT_SESSIONS_REPOSITORY)
    private readonly repository: ICheckoutSessionsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateCheckoutSessionDtoIn,
  ): Promise<UpdateCheckoutSessionDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('checkout session not found');
      }

      const newDataForHistory = this.removeNullValues({
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
      });

      const historyDtoOut = this.buildChangesHistoryService.exec(
        new BuildChangesHistoryDtoIn({
          currentChangesHistory: currentRow.changesHistory,
          oldData: this.buildOldData(currentRow),
          newData: newDataForHistory,
          source: dtoIn.source,
        }),
      );

      const row = await this.repository.updateByUniqueId(dtoIn._id, {
        office_id: dtoIn.officeId,
        client_id: dtoIn.clientId,
        payment_customer_id: dtoIn.paymentCustomerId,
        gateway_id: dtoIn.gatewayId,
        api_credential_id: dtoIn.apiCredentialId,
        code: dtoIn.code,
        external_reference: dtoIn.externalReference,
        idempotency_key: dtoIn.idempotencyKey,
        payment_type: dtoIn.paymentType,
        amount: dtoIn.amount,
        currency: dtoIn.currency,
        description: dtoIn.description,
        success_url: dtoIn.successUrl,
        cancel_url: dtoIn.cancelUrl,
        expires_at: dtoIn.expiresAt,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateCheckoutSessionDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update checkout session';

      throw new Error(message);
    }
  }

  private removeNullValues(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null),
    );
  }

  private buildOldData(row: CheckoutSessionRow): Record<string, unknown> {
    return {
      officeId: row.officeId,
      clientId: row.clientId,
      paymentCustomerId: row.paymentCustomerId,
      gatewayId: row.gatewayId,
      apiCredentialId: row.apiCredentialId,
      code: row.code,
      externalReference: row.externalReference,
      idempotencyKey: row.idempotencyKey,
      paymentType: row.paymentType,
      amount: row.amount,
      currency: row.currency,
      description: row.description,
      successUrl: row.successUrl,
      cancelUrl: row.cancelUrl,
      expiresAt: row.expiresAt,
      metadata: row.metadata,
      config: row.config,
      status: row.status,
    };
  }
}