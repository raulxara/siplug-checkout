export declare class CreatePaymentSplitRecipientDtoIn {
    readonly paymentSplitId: string;
    readonly splitRecipientId: string;
    readonly gatewayRecipientId: string | null;
    readonly gatewayTransferId: string | null;
    readonly role: string;
    readonly amount: number;
    readonly percentage: number | null;
    readonly currency: string;
    readonly providerPayload: Record<string, unknown> | null;
    readonly providerResponse: Record<string, unknown> | null;
    readonly gatewayResponse: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(paymentSplitId: string, splitRecipientId: string, gatewayRecipientId: string | null, gatewayTransferId: string | null, role: string, amount: number, percentage: number | null, currency: string, providerPayload: Record<string, unknown> | null, providerResponse: Record<string, unknown> | null, gatewayResponse: Record<string, unknown> | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string);
}
