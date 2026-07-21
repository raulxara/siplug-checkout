export declare class FetchMercadoPagoPaymentDtoOut {
    readonly gatewayTransactionId: string | null;
    readonly gatewayStatus: string | null;
    readonly status: string;
    readonly processStatus: string;
    readonly processMessage: string;
    readonly providerResponse: Record<string, unknown>;
    readonly gatewayResponse: Record<string, unknown>;
    readonly qrCode: string | null;
    readonly qrCodeBase64: string | null;
    readonly checkoutUrl: string | null;
    readonly paidAt: string | null;
    readonly authorizedAt: string | null;
    readonly canceledAt: string | null;
    readonly failedAt: string | null;
    readonly refundedAt: string | null;
    readonly expiresAt: string | null;
    constructor(gatewayTransactionId: string | null, gatewayStatus: string | null, status: string, processStatus: string, processMessage: string, providerResponse: Record<string, unknown>, gatewayResponse: Record<string, unknown>, qrCode: string | null, qrCodeBase64: string | null, checkoutUrl: string | null, paidAt: string | null, authorizedAt: string | null, canceledAt: string | null, failedAt: string | null, refundedAt: string | null, expiresAt: string | null);
}
