export declare class GatewayRecurringPaymentDtoOut {
    readonly success: boolean;
    readonly provider: string;
    readonly gatewaySubscriptionId: string | null;
    readonly gatewayPlanId: string | null;
    readonly gatewayInvoiceId: string | null;
    readonly gatewayTransactionId: string | null;
    readonly gatewayStatus: string | null;
    readonly status: string;
    readonly processStatus: string;
    readonly processMessage: string;
    readonly providerRequest: Record<string, unknown> | null;
    readonly providerResponse: Record<string, unknown> | null;
    readonly gatewayResponse: Record<string, unknown> | null;
    readonly checkoutUrl: string | null;
    readonly approvalUrl: string | null;
    readonly qrCode: string | null;
    readonly qrCodeBase64: string | null;
    readonly boletoUrl: string | null;
    readonly paidAt: string | null;
    readonly authorizedAt: string | null;
    readonly canceledAt: string | null;
    readonly failedAt: string | null;
    readonly refundedAt: string | null;
    readonly expiresAt: string | null;
    constructor(success: boolean, provider: string, gatewaySubscriptionId: string | null, gatewayPlanId: string | null, gatewayInvoiceId: string | null, gatewayTransactionId: string | null, gatewayStatus: string | null, status: string, processStatus: string, processMessage: string, providerRequest: Record<string, unknown> | null, providerResponse: Record<string, unknown> | null, gatewayResponse: Record<string, unknown> | null, checkoutUrl?: string | null, approvalUrl?: string | null, qrCode?: string | null, qrCodeBase64?: string | null, boletoUrl?: string | null, paidAt?: string | null, authorizedAt?: string | null, canceledAt?: string | null, failedAt?: string | null, refundedAt?: string | null, expiresAt?: string | null);
}
