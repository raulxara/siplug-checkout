export declare class ProcessPaymentRequest {
    token?: string;
    checkoutSessionId: string;
    paymentMethod: string;
    installments?: number | null;
    installmentAmount?: number | null;
    interestAmount?: number | null;
    interestType?: string | null;
    idempotencyKey?: string | null;
    externalReference?: string | null;
    payer?: Record<string, unknown> | null;
    paymentData?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
}
