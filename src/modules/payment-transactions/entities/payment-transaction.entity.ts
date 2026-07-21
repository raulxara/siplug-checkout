import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPaymentTransactionsRepository } from './payment-transactions-repository.interface';

export class PaymentTransactionEntity extends AbstractEntity {
  public officeId!: string;
  public clientId!: string;
  public checkoutSessionId: string | null = null;
  public paymentCustomerId: string | null = null;

  public gatewayId!: string;
  public apiCredentialId: string | null = null;

  public gatewayTransactionId: string | null = null;
  public externalReference: string | null = null;
  public idempotencyKey: string | null = null;

  public paymentType!: string;
  public paymentMethod!: string;

  public amount!: number;
  public currency!: string;

  public installments: number | null = null;
  public installmentAmount: number | null = null;
  public interestAmount: number | null = null;
  public interestType: string | null = null;

  public gatewayStatus: string | null = null;
  public processStatus!: string;
  public processMessage: string | null = null;

  public providerPayload: Record<string, unknown> | null = null;
  public providerResponse: Record<string, unknown> | null = null;
  public gatewayResponse: Record<string, unknown> | null = null;

  public qrCode: string | null = null;
  public qrCodeBase64: string | null = null;
  public boletoUrl: string | null = null;
  public checkoutUrl: string | null = null;

  public splitRequired = false;
  public hasSplit = false;

  public paidAt: string | null = null;
  public authorizedAt: string | null = null;
  public canceledAt: string | null = null;
  public failedAt: string | null = null;
  public refundedAt: string | null = null;
  public expiresAt: string | null = null;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IPaymentTransactionsRepository) {
    super();
  }

  async create(): Promise<PaymentTransactionEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      officeId: fresh.officeId,
      clientId: fresh.clientId,
      checkoutSessionId: fresh.checkoutSessionId,
      paymentCustomerId: fresh.paymentCustomerId,
      gatewayId: fresh.gatewayId,
      apiCredentialId: fresh.apiCredentialId,
      gatewayTransactionId: fresh.gatewayTransactionId,
      externalReference: fresh.externalReference,
      idempotencyKey: fresh.idempotencyKey,
      paymentType: fresh.paymentType,
      paymentMethod: fresh.paymentMethod,
      amount: fresh.amount,
      currency: fresh.currency,
      installments: fresh.installments,
      installmentAmount: fresh.installmentAmount,
      interestAmount: fresh.interestAmount,
      interestType: fresh.interestType,
      gatewayStatus: fresh.gatewayStatus,
      status: fresh.status,
      processStatus: fresh.processStatus,
      processMessage: fresh.processMessage,
      providerPayload: fresh.providerPayload,
      providerResponse: fresh.providerResponse,
      gatewayResponse: fresh.gatewayResponse,
      qrCode: fresh.qrCode,
      qrCodeBase64: fresh.qrCodeBase64,
      boletoUrl: fresh.boletoUrl,
      checkoutUrl: fresh.checkoutUrl,
      splitRequired: fresh.splitRequired,
      hasSplit: fresh.hasSplit,
      paidAt: fresh.paidAt,
      authorizedAt: fresh.authorizedAt,
      canceledAt: fresh.canceledAt,
      failedAt: fresh.failedAt,
      refundedAt: fresh.refundedAt,
      expiresAt: fresh.expiresAt,
      metadata: fresh.metadata,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}
