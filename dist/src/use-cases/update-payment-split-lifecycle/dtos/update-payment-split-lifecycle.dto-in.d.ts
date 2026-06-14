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
export declare class UpdatePaymentSplitLifecycleDtoIn {
    readonly token: string;
    readonly paymentSplitId: string;
    readonly status: string;
    readonly gatewaySplitId: string | null;
    readonly providerPayload: Record<string, unknown> | null;
    readonly providerResponse: Record<string, unknown> | null;
    readonly gatewayResponse: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly recipients: UpdatePaymentSplitLifecycleRecipientDtoIn[];
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
    });
    private parseRecipients;
    private parseRecipient;
    private validateStatus;
    private toNullableString;
    private toNullableObject;
}
