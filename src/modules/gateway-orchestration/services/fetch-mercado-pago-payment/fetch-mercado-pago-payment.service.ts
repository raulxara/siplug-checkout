import { Injectable } from '@nestjs/common';
import { FetchMercadoPagoPaymentDtoIn } from './dtos/fetch-mercado-pago-payment.dto-in';
import { FetchMercadoPagoPaymentDtoOut } from './dtos/fetch-mercado-pago-payment.dto-out';

type MercadoPagoPaymentResponse = {
  id?: number | string;
  status?: string;
  status_detail?: string;
  date_approved?: string | null;
  date_of_expiration?: string | null;
  date_last_updated?: string | null;
  payment_method_id?: string;
  payment_type_id?: string;
  external_reference?: string | null;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
      transaction_id?: string | null;
    };
  };
  cause?: Array<{
    code?: number | string;
    data?: string;
    description?: string;
    message?: string;
  }>;
  error?: string;
  message?: string;
  [key: string]: unknown;
};

@Injectable()
export class FetchMercadoPagoPaymentService {
  async exec(
    dtoIn: FetchMercadoPagoPaymentDtoIn,
  ): Promise<FetchMercadoPagoPaymentDtoOut> {
    try {
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${encodeURIComponent(
          dtoIn.paymentId,
        )}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${dtoIn.accessToken}`,
          },
        },
      );

      const responseBody = (await response.json().catch(() => ({
        message: 'Mercado Pago returned a non JSON response',
      }))) as MercadoPagoPaymentResponse;

      if (!response.ok) {
        return new FetchMercadoPagoPaymentDtoOut(
          this.toNullableString(responseBody.id),
          String(response.status),
          'failed',
          'gateway_status_fetch_failed',
          this.extractMercadoPagoErrorMessage(responseBody) ??
            `Mercado Pago payment fetch failed with status ${response.status}`,
          responseBody as Record<string, unknown>,
          {
            ok: false,
            endpoint: '/v1/payments/{id}',
            httpStatus: response.status,
            paymentId: dtoIn.paymentId,
          },
          null,
          null,
          null,
          null,
          null,
          null,
          this.nowAsSqlDateTime(),
          null,
          null,
        );
      }

      const gatewayStatus =
        this.toNullableString(responseBody.status) ?? 'unknown';

      const gatewayStatusDetail = this.toNullableString(
        responseBody.status_detail,
      );

      const status = this.mapMercadoPagoStatusToInternalStatus({
        status: gatewayStatus,
        statusDetail: gatewayStatusDetail,
      });

      const processStatus = this.mapMercadoPagoStatusToProcessStatus({
        status: gatewayStatus,
        statusDetail: gatewayStatusDetail,
      });

      const transactionData =
        responseBody.point_of_interaction?.transaction_data;

      return new FetchMercadoPagoPaymentDtoOut(
        this.toNullableString(responseBody.id),
        gatewayStatus,
        status,
        processStatus,
        `Mercado Pago payment synchronized with status ${gatewayStatus}${
          gatewayStatusDetail !== null ? `/${gatewayStatusDetail}` : ''
        }`,
        responseBody as Record<string, unknown>,
        {
          ok: true,
          endpoint: '/v1/payments/{id}',
          httpStatus: response.status,
          paymentId: responseBody.id ?? dtoIn.paymentId,
          paymentStatus: responseBody.status ?? null,
          paymentStatusDetail: responseBody.status_detail ?? null,
        },
        transactionData?.qr_code ?? null,
        transactionData?.qr_code_base64 ?? null,
        transactionData?.ticket_url ?? null,
        status === 'paid'
          ? this.formatExternalDate(responseBody.date_approved) ??
            this.nowAsSqlDateTime()
          : null,
        status === 'authorized' ? this.nowAsSqlDateTime() : null,
        status === 'canceled' ? this.nowAsSqlDateTime() : null,
        status === 'failed' ? this.nowAsSqlDateTime() : null,
        status === 'refunded' ? this.nowAsSqlDateTime() : null,
        this.formatExternalDate(responseBody.date_of_expiration),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on fetch Mercado Pago payment';

      throw new Error(message);
    }
  }

  private mapMercadoPagoStatusToInternalStatus(params: {
    status: string;
    statusDetail: string | null;
  }): string {
    const status = params.status.toLowerCase().trim();
    const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;

    if (status === 'approved') {
      return 'paid';
    }

    if (status === 'authorized') {
      return 'authorized';
    }

    if (
      status === 'pending' ||
      status === 'in_process' ||
      statusDetail === 'pending_waiting_transfer'
    ) {
      return 'pending';
    }

    if (status === 'rejected' || status === 'failed') {
      return 'failed';
    }

    if (status === 'cancelled' || status === 'canceled') {
      return 'canceled';
    }

    if (status === 'refunded') {
      return 'refunded';
    }

    return 'processing';
  }

  private mapMercadoPagoStatusToProcessStatus(params: {
    status: string;
    statusDetail: string | null;
  }): string {
    const status = params.status.toLowerCase().trim();
    const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;

    if (status === 'approved') {
      return 'gateway_approved';
    }

    if (status === 'authorized') {
      return 'gateway_authorized';
    }

    if (
      status === 'pending' ||
      status === 'in_process' ||
      statusDetail === 'pending_waiting_transfer'
    ) {
      return 'gateway_pending';
    }

    if (status === 'rejected' || status === 'failed') {
      return 'gateway_rejected';
    }

    if (status === 'cancelled' || status === 'canceled') {
      return 'gateway_cancelled';
    }

    if (status === 'refunded') {
      return 'gateway_refunded';
    }

    return 'gateway_synced';
  }

  private extractMercadoPagoErrorMessage(
    responseBody: MercadoPagoPaymentResponse,
  ): string | null {
    const message = this.toNullableString(responseBody.message);

    if (message !== null) {
      return message;
    }

    const error = this.toNullableString(responseBody.error);

    if (error !== null) {
      return error;
    }

    const cause = responseBody.cause;

    if (Array.isArray(cause) && cause.length > 0) {
      const firstCause = cause[0];

      return (
        this.toNullableString(firstCause.description) ??
        this.toNullableString(firstCause.message) ??
        this.toNullableString(firstCause.code)
      );
    }

    return null;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private formatExternalDate(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return this.formatDateToSqlDateTime(date);
  }

  private nowAsSqlDateTime(): string {
    return this.formatDateToSqlDateTime(new Date());
  }

  private formatDateToSqlDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());
    const seconds = this.pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
