export declare class UpdatePaymentSplitRecipientDtoIn {
    readonly _id: string;
    readonly gatewayRecipientId: string | null | undefined;
    readonly gatewayTransferId: string | null | undefined;
    readonly providerPayload: Record<string, unknown> | null | undefined;
    readonly providerResponse: Record<string, unknown> | null | undefined;
    readonly gatewayResponse: Record<string, unknown> | null | undefined;
    readonly metadata: Record<string, unknown> | null | undefined;
    readonly config: Record<string, unknown> | null | undefined;
    readonly status: string | undefined;
    readonly source: string;
    constructor(params: {
        _id?: unknown;
        gatewayRecipientId?: unknown;
        gatewayTransferId?: unknown;
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
