export declare class UpdatePaymentSplitDtoIn {
    readonly _id: string;
    readonly gatewaySplitId: string | null | undefined;
    readonly providerPayload: Record<string, unknown> | null | undefined;
    readonly providerResponse: Record<string, unknown> | null | undefined;
    readonly gatewayResponse: Record<string, unknown> | null | undefined;
    readonly metadata: Record<string, unknown> | null | undefined;
    readonly config: Record<string, unknown> | null | undefined;
    readonly status: string | undefined;
    readonly source: string;
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
    });
    private toOptionalNullableString;
    private toOptionalNullableObject;
}
