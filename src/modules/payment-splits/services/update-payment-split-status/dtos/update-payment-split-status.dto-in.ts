export class UpdatePaymentSplitStatusDtoIn {
  constructor(
    public readonly _id: string,
    public readonly status: string,

    public readonly gatewaySplitId: string | null,

    public readonly providerPayload: Record<string, unknown> | null,
    public readonly providerResponse: Record<string, unknown> | null,
    public readonly gatewayResponse: Record<string, unknown> | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly source: string,
  ) {}
}
