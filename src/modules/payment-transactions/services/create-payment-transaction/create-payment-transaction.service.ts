import { Inject, Injectable } from '@nestjs/common';
import { PaymentTransactionEntity } from '../../entities/payment-transaction.entity';
import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from '../../tokens/payment-transactions.tokens';
import { CreatePaymentTransactionDtoIn } from './dtos/create-payment-transaction.dto-in';
import { CreatePaymentTransactionDtoOut } from './dtos/create-payment-transaction.dto-out';

@Injectable()
export class CreatePaymentTransactionService {
  constructor(
    @Inject(PAYMENT_TRANSACTIONS_REPOSITORY)
    private readonly repository: IPaymentTransactionsRepository,
  ) {}

  async exec(
    dtoIn: CreatePaymentTransactionDtoIn,
  ): Promise<CreatePaymentTransactionDtoOut> {
    try {
      const entity = new PaymentTransactionEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.clientId = dtoIn.clientId;
      entity.checkoutSessionId = dtoIn.checkoutSessionId;
      entity.paymentCustomerId = dtoIn.paymentCustomerId;

      entity.gatewayId = dtoIn.gatewayId;
      entity.apiCredentialId = dtoIn.apiCredentialId;

      entity.gatewayTransactionId = dtoIn.gatewayTransactionId;
      entity.externalReference = dtoIn.externalReference;
      entity.idempotencyKey = dtoIn.idempotencyKey;

      entity.paymentType = dtoIn.paymentType;
      entity.paymentMethod = dtoIn.paymentMethod;

      entity.amount = dtoIn.amount;
      entity.currency = dtoIn.currency;

      entity.installments = dtoIn.installments;
      entity.installmentAmount = dtoIn.installmentAmount;
      entity.interestAmount = dtoIn.interestAmount;
      entity.interestType = dtoIn.interestType;

      entity.gatewayStatus = dtoIn.gatewayStatus;
      entity.status = dtoIn.status;
      entity.processStatus = dtoIn.processStatus;
      entity.processMessage = dtoIn.processMessage;

      entity.providerPayload = dtoIn.providerPayload;
      entity.providerResponse = dtoIn.providerResponse;
      entity.gatewayResponse = dtoIn.gatewayResponse;

      entity.qrCode = dtoIn.qrCode;
      entity.qrCodeBase64 = dtoIn.qrCodeBase64;
      entity.boletoUrl = dtoIn.boletoUrl;
      entity.checkoutUrl = dtoIn.checkoutUrl;

      entity.splitRequired = dtoIn.splitRequired;
      entity.hasSplit = dtoIn.hasSplit;

      entity.paidAt = dtoIn.paidAt;
      entity.authorizedAt = dtoIn.authorizedAt;
      entity.canceledAt = dtoIn.canceledAt;
      entity.failedAt = dtoIn.failedAt;
      entity.refundedAt = dtoIn.refundedAt;
      entity.expiresAt = dtoIn.expiresAt;

      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;

      await entity.create();

      return CreatePaymentTransactionDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create payment transaction';

      throw new Error(message);
    }
  }
}
