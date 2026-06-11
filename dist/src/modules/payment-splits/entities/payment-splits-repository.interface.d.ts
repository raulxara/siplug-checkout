import type { PaymentSplitEntity } from './payment-split.entity';
export type PaymentSplitRow = {
    id: number;
    _id: string;
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
};
export interface IPaymentSplitsRepository {
    create(entity: PaymentSplitEntity): Promise<PaymentSplitEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentSplitRow>;
    findByUniqueId(_id: string): Promise<PaymentSplitRow | null>;
    getAllByPaymentTransactionId(paymentTransactionId: string): Promise<PaymentSplitRow[]>;
    getAllByOfficeId(officeId: string): Promise<PaymentSplitRow[]>;
}
