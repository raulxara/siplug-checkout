export class GatewaySplitTransferDtoOut {
  constructor(
    public readonly dispatched: boolean,
    public readonly gatewayProvider: string,
    public readonly status: string,
    public readonly gatewaySplitId: string | null,
    public readonly transfers: Array<Record<string, unknown>>,
    public readonly providerRequest: Record<string, unknown> | null,
    public readonly providerResponse: Record<string, unknown> | null,
    public readonly gatewayResponse: Record<string, unknown> | null,
    public readonly errorMessage: string | null,
  ) {}
}
