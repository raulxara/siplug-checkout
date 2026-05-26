export declare class ProcessPaymentDtoIn {
    readonly token: string;
    readonly checkoutSessionId: string;
    readonly paymentMethod: string;
    readonly installments: number | null;
    readonly installmentAmount: number | null;
    readonly interestAmount: number | null;
    readonly interestType: string | null;
    readonly idempotencyKey: string | null;
    readonly externalReference: string | null;
    readonly payer: Record<string, unknown> | null;
    readonly paymentData: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    constructor(params: {
        token?: string;
        checkoutSessionId?: string;
        paymentMethod?: string;
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
    });
}
