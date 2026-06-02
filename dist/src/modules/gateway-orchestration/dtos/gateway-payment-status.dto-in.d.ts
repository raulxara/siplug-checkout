import type { PaymentTransactionRow } from '../../payment-transactions/entities/payment-transactions-repository.interface';
export type GatewayStatusApiCredentialData = {
    _id: string;
    slug: string;
    gatewayId: string | null;
    token: string | null;
    config: Record<string, unknown> | null;
    connectionData: Record<string, unknown> | null;
};
export declare class GatewayPaymentStatusDtoIn {
    readonly gatewayProvider: string;
    readonly gatewaySlug: string;
    readonly paymentTransaction: PaymentTransactionRow;
    readonly apiCredential: GatewayStatusApiCredentialData | null;
    readonly config: {
        gatewayConfig?: Record<string, unknown> | null;
        transactionConfig?: Record<string, unknown> | null;
        apiCredentialConfig?: Record<string, unknown> | null;
    };
    constructor(params: {
        gatewayProvider: string;
        gatewaySlug: string;
        paymentTransaction: PaymentTransactionRow;
        apiCredential: GatewayStatusApiCredentialData | null;
        config?: {
            gatewayConfig?: Record<string, unknown> | null;
            transactionConfig?: Record<string, unknown> | null;
            apiCredentialConfig?: Record<string, unknown> | null;
        };
    });
}
