export declare class UpdatePaymentSplitRecipientStatusDtoIn {
    readonly _id: string;
    readonly status: string;
    readonly gatewayRecipientId: string | null;
    readonly gatewayTransferId: string | null;
    readonly providerPayload: Record<string, unknown> | null;
    readonly providerResponse: Record<string, unknown> | null;
    readonly gatewayResponse: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly source: string;
    constructor(_id: string, status: string, gatewayRecipientId: string | null, gatewayTransferId: string | null, providerPayload: Record<string, unknown> | null, providerResponse: Record<string, unknown> | null, gatewayResponse: Record<string, unknown> | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, source: string);
}
