import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentTransactionEntity } from '../entities/payment-transaction.entity';
import type {
  IPaymentTransactionsRepository,
  PaymentTransactionRow,
} from '../entities/payment-transactions-repository.interface';

@Injectable()
export class PaymentTransactionsRepository
  implements IPaymentTransactionsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: PaymentTransactionEntity,
  ): Promise<PaymentTransactionEntity> {
    const model = await this.prisma.paymentTransaction.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),

        office_id: entity.officeId,
        client_id: entity.clientId,
        checkout_session_id: entity.checkoutSessionId,
        payment_customer_id: entity.paymentCustomerId,

        gateway_id: entity.gatewayId,
        api_credential_id: entity.apiCredentialId,

        gateway_transaction_id: entity.gatewayTransactionId,
        external_reference: entity.externalReference,
        idempotency_key: entity.idempotencyKey,

        payment_type: entity.paymentType,
        payment_method: entity.paymentMethod,

        amount: entity.amount,
        currency: entity.currency,

        installments: entity.installments,
        installment_amount: entity.installmentAmount,
        interest_amount: entity.interestAmount,
        interest_type: entity.interestType,

        gateway_status: entity.gatewayStatus,
        status: entity.status ?? 'created',
        process_status: entity.processStatus ?? 'pending',
        process_message: entity.processMessage,

        provider_payload:
          entity.providerPayload === null
            ? Prisma.JsonNull
            : (entity.providerPayload as Prisma.InputJsonValue),

        provider_response:
          entity.providerResponse === null
            ? Prisma.JsonNull
            : (entity.providerResponse as Prisma.InputJsonValue),

        gateway_response:
          entity.gatewayResponse === null
            ? Prisma.JsonNull
            : (entity.gatewayResponse as Prisma.InputJsonValue),

        qr_code: entity.qrCode,
        qr_code_base64: entity.qrCodeBase64,
        boleto_url: entity.boletoUrl,
        checkout_url: entity.checkoutUrl,

        split_required: entity.splitRequired,
        has_split: entity.hasSplit,

        paid_at: entity.paidAt ? new Date(entity.paidAt) : null,
        authorized_at: entity.authorizedAt
          ? new Date(entity.authorizedAt)
          : null,
        canceled_at: entity.canceledAt ? new Date(entity.canceledAt) : null,
        failed_at: entity.failedAt ? new Date(entity.failedAt) : null,
        refunded_at: entity.refundedAt ? new Date(entity.refundedAt) : null,
        expires_at: entity.expiresAt ? new Date(entity.expiresAt) : null,

        metadata:
          entity.metadata === null
            ? Prisma.JsonNull
            : (entity.metadata as Prisma.InputJsonValue),

        config:
          entity.config === null
            ? Prisma.JsonNull
            : (entity.config as Prisma.InputJsonValue),

        changes_history:
          entity.changesHistory === null
            ? Prisma.JsonNull
            : (entity.changesHistory as Prisma.InputJsonValue),
      },
    });

    const fresh = new PaymentTransactionEntity(this);
    this.hydrateEntityFromModel(fresh, model);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<PaymentTransactionRow> {
    const updateData: Prisma.PaymentTransactionUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
    }

    if (
      data.checkout_session_id !== undefined &&
      data.checkout_session_id !== null
    ) {
      updateData.checkout_session_id = String(data.checkout_session_id);
    }

    if (
      data.payment_customer_id !== undefined &&
      data.payment_customer_id !== null
    ) {
      updateData.payment_customer_id = String(data.payment_customer_id);
    }

    if (data.gateway_id !== undefined && data.gateway_id !== null) {
      updateData.gateway_id = String(data.gateway_id);
    }

    if (
      data.api_credential_id !== undefined &&
      data.api_credential_id !== null
    ) {
      updateData.api_credential_id = String(data.api_credential_id);
    }

    if (
      data.gateway_transaction_id !== undefined &&
      data.gateway_transaction_id !== null
    ) {
      updateData.gateway_transaction_id = String(data.gateway_transaction_id);
    }

    if (
      data.external_reference !== undefined &&
      data.external_reference !== null
    ) {
      updateData.external_reference = String(data.external_reference);
    }

    if (
      data.idempotency_key !== undefined &&
      data.idempotency_key !== null
    ) {
      updateData.idempotency_key = String(data.idempotency_key);
    }

    if (data.payment_type !== undefined && data.payment_type !== null) {
      updateData.payment_type = String(data.payment_type);
    }

    if (data.payment_method !== undefined && data.payment_method !== null) {
      updateData.payment_method = String(data.payment_method);
    }

    if (data.amount !== undefined && data.amount !== null) {
      updateData.amount = Number(data.amount);
    }

    if (data.currency !== undefined && data.currency !== null) {
      updateData.currency = String(data.currency);
    }

    if (data.installments !== undefined && data.installments !== null) {
      updateData.installments = Number(data.installments);
    }

    if (
      data.installment_amount !== undefined &&
      data.installment_amount !== null
    ) {
      updateData.installment_amount = Number(data.installment_amount);
    }

    if (data.interest_amount !== undefined && data.interest_amount !== null) {
      updateData.interest_amount = Number(data.interest_amount);
    }

    if (data.interest_type !== undefined && data.interest_type !== null) {
      updateData.interest_type = String(data.interest_type);
    }

    if (data.gateway_status !== undefined && data.gateway_status !== null) {
      updateData.gateway_status = String(data.gateway_status);
    }

    if (data.status !== undefined && data.status !== null) {
      updateData.status = String(data.status);
    }

    if (data.process_status !== undefined && data.process_status !== null) {
      updateData.process_status = String(data.process_status);
    }

    if (data.process_message !== undefined && data.process_message !== null) {
      updateData.process_message = String(data.process_message);
    }

    if (data.provider_payload !== undefined && data.provider_payload !== null) {
      updateData.provider_payload =
        data.provider_payload as Prisma.InputJsonValue;
    }

    if (
      data.provider_response !== undefined &&
      data.provider_response !== null
    ) {
      updateData.provider_response =
        data.provider_response as Prisma.InputJsonValue;
    }

    if (
      data.gateway_response !== undefined &&
      data.gateway_response !== null
    ) {
      updateData.gateway_response =
        data.gateway_response as Prisma.InputJsonValue;
    }

    if (data.qr_code !== undefined && data.qr_code !== null) {
      updateData.qr_code = String(data.qr_code);
    }

    if (data.qr_code_base64 !== undefined && data.qr_code_base64 !== null) {
      updateData.qr_code_base64 = String(data.qr_code_base64);
    }

    if (data.boleto_url !== undefined && data.boleto_url !== null) {
      updateData.boleto_url = String(data.boleto_url);
    }

    if (data.checkout_url !== undefined && data.checkout_url !== null) {
      updateData.checkout_url = String(data.checkout_url);
    }

    if (data.split_required !== undefined && data.split_required !== null) {
      updateData.split_required = Boolean(data.split_required);
    }

    if (data.has_split !== undefined && data.has_split !== null) {
      updateData.has_split = Boolean(data.has_split);
    }

    if (data.paid_at !== undefined && data.paid_at !== null) {
      updateData.paid_at = new Date(String(data.paid_at));
    }

    if (data.authorized_at !== undefined && data.authorized_at !== null) {
      updateData.authorized_at = new Date(String(data.authorized_at));
    }

    if (data.canceled_at !== undefined && data.canceled_at !== null) {
      updateData.canceled_at = new Date(String(data.canceled_at));
    }

    if (data.failed_at !== undefined && data.failed_at !== null) {
      updateData.failed_at = new Date(String(data.failed_at));
    }

    if (data.refunded_at !== undefined && data.refunded_at !== null) {
      updateData.refunded_at = new Date(String(data.refunded_at));
    }

    if (data.expires_at !== undefined && data.expires_at !== null) {
      updateData.expires_at = new Date(String(data.expires_at));
    }

    if (data.metadata !== undefined && data.metadata !== null) {
      updateData.metadata = data.metadata as Prisma.InputJsonValue;
    }

    if (data.config !== undefined && data.config !== null) {
      updateData.config = data.config as Prisma.InputJsonValue;
    }

    if (data.changes_history !== undefined && data.changes_history !== null) {
      updateData.changes_history =
        data.changes_history as Prisma.InputJsonValue;
    }

    const model = await this.prisma.paymentTransaction.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<PaymentTransactionRow | null> {
    const model = await this.prisma.paymentTransaction.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByGatewayTransactionId(
    gatewayTransactionId: string,
  ): Promise<PaymentTransactionRow | null> {
    const model = await this.prisma.paymentTransaction.findFirst({
      where: {
        gateway_transaction_id: gatewayTransactionId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<PaymentTransactionRow[]> {
    const rows = await this.prisma.paymentTransaction.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(
    officeId: string,
  ): Promise<PaymentTransactionRow[]> {
    const rows = await this.prisma.paymentTransaction.findMany({
      where: {
        office_id: officeId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByCheckoutSessionId(
    checkoutSessionId: string,
  ): Promise<PaymentTransactionRow[]> {
    const rows = await this.prisma.paymentTransaction.findMany({
      where: {
        checkout_session_id: checkoutSessionId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private hydrateEntityFromModel(
    entity: PaymentTransactionEntity,
    model: PaymentTransactionPrismaModel,
  ): void {
    const row = this.toRow(model);

    entity.id = row.id;
    entity._id = row._id;
    entity.officeId = row.officeId;
    entity.clientId = row.clientId;
    entity.checkoutSessionId = row.checkoutSessionId;
    entity.paymentCustomerId = row.paymentCustomerId;
    entity.gatewayId = row.gatewayId;
    entity.apiCredentialId = row.apiCredentialId;
    entity.gatewayTransactionId = row.gatewayTransactionId;
    entity.externalReference = row.externalReference;
    entity.idempotencyKey = row.idempotencyKey;
    entity.paymentType = row.paymentType;
    entity.paymentMethod = row.paymentMethod;
    entity.amount = row.amount;
    entity.currency = row.currency;
    entity.installments = row.installments;
    entity.installmentAmount = row.installmentAmount;
    entity.interestAmount = row.interestAmount;
    entity.interestType = row.interestType;
    entity.gatewayStatus = row.gatewayStatus;
    entity.status = row.status;
    entity.processStatus = row.processStatus;
    entity.processMessage = row.processMessage;
    entity.providerPayload = row.providerPayload;
    entity.providerResponse = row.providerResponse;
    entity.gatewayResponse = row.gatewayResponse;
    entity.qrCode = row.qrCode;
    entity.qrCodeBase64 = row.qrCodeBase64;
    entity.boletoUrl = row.boletoUrl;
    entity.checkoutUrl = row.checkoutUrl;
    entity.splitRequired = row.splitRequired;
    entity.hasSplit = row.hasSplit;
    entity.paidAt = row.paidAt;
    entity.authorizedAt = row.authorizedAt;
    entity.canceledAt = row.canceledAt;
    entity.failedAt = row.failedAt;
    entity.refundedAt = row.refundedAt;
    entity.expiresAt = row.expiresAt;
    entity.metadata = row.metadata;
    entity.config = row.config;
    entity.changesHistory = row.changesHistory;
    entity.createdAt = row.createdAt;
    entity.updatedAt = row.updatedAt;
  }

  private toRow(model: PaymentTransactionPrismaModel): PaymentTransactionRow {
    return {
      id: model.id,
      _id: model.unique_id,

      officeId: model.office_id,
      clientId: model.client_id,
      checkoutSessionId: model.checkout_session_id,
      paymentCustomerId: model.payment_customer_id,

      gatewayId: model.gateway_id,
      apiCredentialId: model.api_credential_id,

      gatewayTransactionId: model.gateway_transaction_id,
      externalReference: model.external_reference,
      idempotencyKey: model.idempotency_key,

      paymentType: model.payment_type,
      paymentMethod: model.payment_method,

      amount: model.amount,
      currency: model.currency,

      installments: model.installments,
      installmentAmount: model.installment_amount,
      interestAmount: model.interest_amount,
      interestType: model.interest_type,

      gatewayStatus: model.gateway_status,
      status: model.status,
      processStatus: model.process_status,
      processMessage: model.process_message,

      providerPayload: this.parseJsonObject(model.provider_payload),
      providerResponse: this.parseJsonObject(model.provider_response),
      gatewayResponse: this.parseJsonObject(model.gateway_response),

      qrCode: model.qr_code,
      qrCodeBase64: model.qr_code_base64,
      boletoUrl: model.boleto_url,
      checkoutUrl: model.checkout_url,

      splitRequired: Boolean(model.split_required),
      hasSplit: Boolean(model.has_split),

      paidAt: model.paid_at ? formatDateTime(model.paid_at) : null,
      authorizedAt: model.authorized_at
        ? formatDateTime(model.authorized_at)
        : null,
      canceledAt: model.canceled_at ? formatDateTime(model.canceled_at) : null,
      failedAt: model.failed_at ? formatDateTime(model.failed_at) : null,
      refundedAt: model.refunded_at ? formatDateTime(model.refunded_at) : null,
      expiresAt: model.expires_at ? formatDateTime(model.expires_at) : null,

      metadata: this.parseJsonObject(model.metadata),
      config: this.parseJsonObject(model.config),
      changesHistory: this.parseChangesHistory(model.changes_history),

      createdAt: formatDateTime(model.created_at),
      updatedAt: model.updated_at ? formatDateTime(model.updated_at) : null,
    };
  }

  private parseJsonObject(
    value: Prisma.JsonValue | null,
  ): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private parseChangesHistory(
    value: Prisma.JsonValue | null,
  ): Array<Record<string, unknown>> | null {
    if (!Array.isArray(value)) {
      return null;
    }

    return value as Array<Record<string, unknown>>;
  }
}

type PaymentTransactionPrismaModel = {
  id: number;
  unique_id: string;

  office_id: string;
  client_id: string;
  checkout_session_id: string | null;
  payment_customer_id: string | null;

  gateway_id: string;
  api_credential_id: string | null;

  gateway_transaction_id: string | null;
  external_reference: string | null;
  idempotency_key: string | null;

  payment_type: string;
  payment_method: string;

  amount: number;
  currency: string;

  installments: number | null;
  installment_amount: number | null;
  interest_amount: number | null;
  interest_type: string | null;

  gateway_status: string | null;
  status: string;
  process_status: string;
  process_message: string | null;

  provider_payload: Prisma.JsonValue | null;
  provider_response: Prisma.JsonValue | null;
  gateway_response: Prisma.JsonValue | null;

  qr_code: string | null;
  qr_code_base64: string | null;
  boleto_url: string | null;
  checkout_url: string | null;

  split_required: boolean;
  has_split: boolean;

  paid_at: Date | null;
  authorized_at: Date | null;
  canceled_at: Date | null;
  failed_at: Date | null;
  refunded_at: Date | null;
  expires_at: Date | null;

  metadata: Prisma.JsonValue | null;
  config: Prisma.JsonValue | null;
  changes_history: Prisma.JsonValue | null;

  created_at: Date;
  updated_at: Date | null;
};
