import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IPaymentTransactionsRepository,
  PaymentTransactionRow,
} from '../../entities/payment-transactions-repository.interface';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from '../../tokens/payment-transactions.tokens';
import { UpdatePaymentTransactionDtoIn } from './dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionDtoOut } from './dtos/update-payment-transaction.dto-out';

@Injectable()
export class UpdatePaymentTransactionService {
  constructor(
    @Inject(PAYMENT_TRANSACTIONS_REPOSITORY)
    private readonly repository: IPaymentTransactionsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentTransactionDtoIn,
  ): Promise<UpdatePaymentTransactionDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('payment transaction not found');
      }

      const newDataForHistory = this.removeNullValues({
        officeId: dtoIn.officeId,
        clientId: dtoIn.clientId,
        checkoutSessionId: dtoIn.checkoutSessionId,
        paymentCustomerId: dtoIn.paymentCustomerId,
        gatewayId: dtoIn.gatewayId,
        apiCredentialId: dtoIn.apiCredentialId,
        gatewayTransactionId: dtoIn.gatewayTransactionId,
        externalReference: dtoIn.externalReference,
        idempotencyKey: dtoIn.idempotencyKey,
        paymentType: dtoIn.paymentType,
        paymentMethod: dtoIn.paymentMethod,
        amount: dtoIn.amount,
        currency: dtoIn.currency,
        installments: dtoIn.installments,
        installmentAmount: dtoIn.installmentAmount,
        interestAmount: dtoIn.interestAmount,
        interestType: dtoIn.interestType,
        gatewayStatus: dtoIn.gatewayStatus,
        status: dtoIn.status,
        processStatus: dtoIn.processStatus,
        processMessage: dtoIn.processMessage,
        providerPayload: dtoIn.providerPayload,
        providerResponse: dtoIn.providerResponse,
        gatewayResponse: dtoIn.gatewayResponse,
        qrCode: dtoIn.qrCode,
        qrCodeBase64: dtoIn.qrCodeBase64,
        boletoUrl: dtoIn.boletoUrl,
        checkoutUrl: dtoIn.checkoutUrl,
        splitRequired: dtoIn.splitRequired,
        hasSplit: dtoIn.hasSplit,
        paidAt: dtoIn.paidAt,
        authorizedAt: dtoIn.authorizedAt,
        canceledAt: dtoIn.canceledAt,
        failedAt: dtoIn.failedAt,
        refundedAt: dtoIn.refundedAt,
        expiresAt: dtoIn.expiresAt,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
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
        checkout_session_id: dtoIn.checkoutSessionId,
        payment_customer_id: dtoIn.paymentCustomerId,

        gateway_id: dtoIn.gatewayId,
        api_credential_id: dtoIn.apiCredentialId,

        gateway_transaction_id: dtoIn.gatewayTransactionId,
        external_reference: dtoIn.externalReference,
        idempotency_key: dtoIn.idempotencyKey,

        payment_type: dtoIn.paymentType,
        payment_method: dtoIn.paymentMethod,

        amount: dtoIn.amount,
        currency: dtoIn.currency,

        installments: dtoIn.installments,
        installment_amount: dtoIn.installmentAmount,
        interest_amount: dtoIn.interestAmount,
        interest_type: dtoIn.interestType,

        gateway_status: dtoIn.gatewayStatus,
        status: dtoIn.status,
        process_status: dtoIn.processStatus,
        process_message: dtoIn.processMessage,

        provider_payload: dtoIn.providerPayload,
        provider_response: dtoIn.providerResponse,
        gateway_response: dtoIn.gatewayResponse,

        qr_code: dtoIn.qrCode,
        qr_code_base64: dtoIn.qrCodeBase64,
        boleto_url: dtoIn.boletoUrl,
        checkout_url: dtoIn.checkoutUrl,

        split_required: dtoIn.splitRequired,
        has_split: dtoIn.hasSplit,

        paid_at: dtoIn.paidAt,
        authorized_at: dtoIn.authorizedAt,
        canceled_at: dtoIn.canceledAt,
        failed_at: dtoIn.failedAt,
        refunded_at: dtoIn.refundedAt,
        expires_at: dtoIn.expiresAt,

        metadata: dtoIn.metadata,
        config: dtoIn.config,

        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
      });

      return new UpdatePaymentTransactionDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update payment transaction';

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

  private buildOldData(row: PaymentTransactionRow): Record<string, unknown> {
    return {
      officeId: row.officeId,
      clientId: row.clientId,
      checkoutSessionId: row.checkoutSessionId,
      paymentCustomerId: row.paymentCustomerId,
      gatewayId: row.gatewayId,
      apiCredentialId: row.apiCredentialId,
      gatewayTransactionId: row.gatewayTransactionId,
      externalReference: row.externalReference,
      idempotencyKey: row.idempotencyKey,
      paymentType: row.paymentType,
      paymentMethod: row.paymentMethod,
      amount: row.amount,
      currency: row.currency,
      installments: row.installments,
      installmentAmount: row.installmentAmount,
      interestAmount: row.interestAmount,
      interestType: row.interestType,
      gatewayStatus: row.gatewayStatus,
      status: row.status,
      processStatus: row.processStatus,
      processMessage: row.processMessage,
      providerPayload: row.providerPayload,
      providerResponse: row.providerResponse,
      gatewayResponse: row.gatewayResponse,
      qrCode: row.qrCode,
      qrCodeBase64: row.qrCodeBase64,
      boletoUrl: row.boletoUrl,
      checkoutUrl: row.checkoutUrl,
      splitRequired: row.splitRequired,
      hasSplit: row.hasSplit,
      paidAt: row.paidAt,
      authorizedAt: row.authorizedAt,
      canceledAt: row.canceledAt,
      failedAt: row.failedAt,
      refundedAt: row.refundedAt,
      expiresAt: row.expiresAt,
      metadata: row.metadata,
      config: row.config,
    };
  }
}
