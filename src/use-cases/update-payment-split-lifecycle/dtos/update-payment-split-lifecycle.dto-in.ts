export type UpdatePaymentSplitLifecycleRecipientDtoIn = {
  paymentSplitRecipientId: string | null;
  splitRecipientId: string | null;
  status: string | null;

  gatewayRecipientId: string | null;
  gatewayTransferId: string | null;

  providerPayload: Record<string, unknown> | null;
  providerResponse: Record<string, unknown> | null;
  gatewayResponse: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  config: Record<string, unknown> | null;
};

export class UpdatePaymentSplitLifecycleDtoIn {
  public readonly token: string;
  public readonly paymentSplitId: string;
  public readonly status: string;

  public readonly gatewaySplitId: string | null;

  public readonly providerPayload: Record<string, unknown> | null;
  public readonly providerResponse: Record<string, unknown> | null;
  public readonly gatewayResponse: Record<string, unknown> | null;
  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly recipients: UpdatePaymentSplitLifecycleRecipientDtoIn[];

  constructor(params: {
    token?: unknown;
    paymentSplitId?: unknown;
    status?: unknown;

    gatewaySplitId?: unknown;

    providerPayload?: unknown;
    providerResponse?: unknown;
    gatewayResponse?: unknown;
    metadata?: unknown;
    config?: unknown;

    recipients?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
    this.status = String(params.status ?? '').trim();

    this.gatewaySplitId = this.toNullableString(params.gatewaySplitId);

    this.providerPayload = this.toNullableObject(params.providerPayload);
    this.providerResponse = this.toNullableObject(params.providerResponse);
    this.gatewayResponse = this.toNullableObject(params.gatewayResponse);
    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);

    this.recipients = this.parseRecipients(params.recipients);

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.paymentSplitId === '') {
      throw new Error('paymentSplitId is required');
    }

    if (this.status === '') {
      throw new Error('status is required');
    }

    this.validateStatus(this.status);
  }

  private parseRecipients(
    value: unknown,
  ): UpdatePaymentSplitLifecycleRecipientDtoIn[] {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      throw new Error('recipients must be an array');
    }

    return value.map((item) => this.parseRecipient(item));
  }

  private parseRecipient(
    value: unknown,
  ): UpdatePaymentSplitLifecycleRecipientDtoIn {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('recipient item must be an object');
    }

    const item = value as Record<string, unknown>;

    const paymentSplitRecipientId = this.toNullableString(
      item.paymentSplitRecipientId,
    );

    const splitRecipientId = this.toNullableString(item.splitRecipientId);

    if (paymentSplitRecipientId === null && splitRecipientId === null) {
      throw new Error(
        'recipient.paymentSplitRecipientId or recipient.splitRecipientId is required',
      );
    }

    const status = this.toNullableString(item.status);

    if (status !== null) {
      this.validateStatus(status);
    }

    return {
      paymentSplitRecipientId,
      splitRecipientId,
      status,

      gatewayRecipientId: this.toNullableString(item.gatewayRecipientId),
      gatewayTransferId: this.toNullableString(item.gatewayTransferId),

      providerPayload: this.toNullableObject(item.providerPayload),
      providerResponse: this.toNullableObject(item.providerResponse),
      gatewayResponse: this.toNullableObject(item.gatewayResponse),
      metadata: this.toNullableObject(item.metadata),
      config: this.toNullableObject(item.config),
    };
  }

  private validateStatus(status: string): void {
    const allowedStatuses = [
      'created',
      'pending_gateway',
      'transferred',
      'failed',
      'refunded',
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`invalid status: ${status}`);
    }
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('value must be an object');
    }

    return value as Record<string, unknown>;
  }
}
