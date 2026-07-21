export declare class UpdatePaymentSplitLifecycleRecipientRequest {
    paymentSplitRecipientId?: string;
    splitRecipientId?: string;
    status?: string;
    gatewayRecipientId?: string;
    gatewayTransferId?: string;
    providerPayload?: Record<string, unknown>;
    providerResponse?: Record<string, unknown>;
    gatewayResponse?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
}
export declare class UpdatePaymentSplitLifecycleRequest {
    token?: string;
    paymentSplitId: string;
    status: string;
    gatewaySplitId?: string;
    providerPayload?: Record<string, unknown>;
    providerResponse?: Record<string, unknown>;
    gatewayResponse?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    recipients?: UpdatePaymentSplitLifecycleRecipientRequest[];
}
