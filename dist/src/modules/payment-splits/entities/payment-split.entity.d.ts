import type { IPaymentSplitsRepository } from './payment-splits-repository.interface';
export declare class PaymentSplitEntity {
    private readonly paymentSplitsRepository?;
    id: number | null;
    _id: string | null;
    officeId: string;
    clientId: string;
    checkoutSessionId: string | null;
    paymentTransactionId: string;
    subscriptionId: string | null;
    subscriptionInvoiceId: string | null;
    splitRuleId: string | null;
    gatewayProvider: string;
    gatewaySplitId: string | null;
    amount: number;
    currency: string;
    providerPayload: Record<string, unknown> | null;
    providerResponse: Record<string, unknown> | null;
    gatewayResponse: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
    constructor(paymentSplitsRepository?: IPaymentSplitsRepository | undefined);
    create(): Promise<PaymentSplitEntity>;
}
