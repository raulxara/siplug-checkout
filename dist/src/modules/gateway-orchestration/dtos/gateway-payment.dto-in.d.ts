import type { PaymentTransactionRow } from '../../payment-transactions/entities/payment-transactions-repository.interface';
export type GatewayApiCredentialData = {
    _id: string | null;
    slug: string | null;
    gatewayId: string | null;
    config: Record<string, unknown> | null;
    connectionData: Record<string, unknown> | null;
};
export declare class GatewayPaymentDtoIn {
    readonly gatewayProvider: string;
    readonly gatewaySlug: string;
    readonly paymentTransaction: PaymentTransactionRow;
    readonly apiCredential: GatewayApiCredentialData | null;
    readonly providerPayload: Record<string, unknown> | null;
    readonly idempotencyKey: string | null;
    readonly config: Record<string, unknown> | null;
    constructor(params: {
        gatewayProvider: string;
        gatewaySlug: string;
        paymentTransaction: PaymentTransactionRow;
        apiCredential?: GatewayApiCredentialData | null;
        providerPayload?: Record<string, unknown> | null;
        idempotencyKey?: string | null;
        config?: Record<string, unknown> | null;
    });
}
