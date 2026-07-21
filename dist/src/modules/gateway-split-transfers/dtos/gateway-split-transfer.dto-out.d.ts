export declare class GatewaySplitTransferDtoOut {
    readonly dispatched: boolean;
    readonly gatewayProvider: string;
    readonly status: string;
    readonly gatewaySplitId: string | null;
    readonly transfers: Array<Record<string, unknown>>;
    readonly providerRequest: Record<string, unknown> | null;
    readonly providerResponse: Record<string, unknown> | null;
    readonly gatewayResponse: Record<string, unknown> | null;
    readonly errorMessage: string | null;
    constructor(dispatched: boolean, gatewayProvider: string, status: string, gatewaySplitId: string | null, transfers: Array<Record<string, unknown>>, providerRequest: Record<string, unknown> | null, providerResponse: Record<string, unknown> | null, gatewayResponse: Record<string, unknown> | null, errorMessage: string | null);
}
