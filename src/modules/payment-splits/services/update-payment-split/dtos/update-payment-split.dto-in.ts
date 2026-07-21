export class UpdatePaymentSplitDtoIn {
  public readonly _id: string;

  public readonly gatewaySplitId: string | null | undefined;

  public readonly providerPayload: Record<string, unknown> | null | undefined;
  public readonly providerResponse: Record<string, unknown> | null | undefined;
  public readonly gatewayResponse: Record<string, unknown> | null | undefined;

  public readonly metadata: Record<string, unknown> | null | undefined;
  public readonly config: Record<string, unknown> | null | undefined;

  public readonly status: string | undefined;
  public readonly source: string;

  constructor(params: {
    _id?: unknown;

    gatewaySplitId?: unknown;

    providerPayload?: unknown;
    providerResponse?: unknown;
    gatewayResponse?: unknown;

    metadata?: unknown;
    config?: unknown;

    status?: unknown;
    source?: unknown;
  }) {
    this._id = String(params._id ?? '').trim();

    this.gatewaySplitId = this.toOptionalNullableString(
      params.gatewaySplitId,
    );

    this.providerPayload = this.toOptionalNullableObject(
      params.providerPayload,
      'providerPayload',
    );

    this.providerResponse = this.toOptionalNullableObject(
      params.providerResponse,
      'providerResponse',
    );

    this.gatewayResponse = this.toOptionalNullableObject(
      params.gatewayResponse,
      'gatewayResponse',
    );

    this.metadata = this.toOptionalNullableObject(params.metadata, 'metadata');
    this.config = this.toOptionalNullableObject(params.config, 'config');

    this.status =
      params.status !== undefined && params.status !== null
        ? String(params.status).trim()
        : undefined;

    this.source = String(
      params.source ?? 'UpdatePaymentSplitService',
    ).trim();

    if (this._id === '') {
      throw new Error('_id is required');
    }

    if (this.status !== undefined && this.status === '') {
      throw new Error('status cannot be empty');
    }
  }

  private toOptionalNullableString(value: unknown): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toOptionalNullableObject(
    value: unknown,
    field: string,
  ): Record<string, unknown> | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }
}
