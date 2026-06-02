export declare class UpdatePaymentTransactionRequest {
    paymentTransactionId: string;
    status?: string;
    gatewayStatus?: string;
    processStatus?: string;
    processMessage?: string;
    qrCode?: string;
    qrCodeBase64?: string;
    boletoUrl?: string;
    checkoutUrl?: string;
    paidAt?: string;
    authorizedAt?: string;
    canceledAt?: string;
    failedAt?: string;
    refundedAt?: string;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
}
