import type { SubscriptionInvoiceEntity } from './subscription-invoice.entity';
export type SubscriptionInvoiceRow = {
    id: number;
    _id: string;
    subscriptionId: string;
    subscriptionCycleId: string | null;
    paymentTransactionId: string | null;
    invoiceNumber: string | null;
    amount: number;
    currency: string;
    dueAt: string | null;
    paidAt: string | null;
    attemptNumber: number;
    externalReference: string | null;
    gatewayInvoiceId: string | null;
    lastAttemptAt: string | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface ISubscriptionInvoicesRepository {
    create(entity: SubscriptionInvoiceEntity): Promise<SubscriptionInvoiceEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SubscriptionInvoiceRow>;
    findByUniqueId(_id: string): Promise<SubscriptionInvoiceRow | null>;
    getAll(): Promise<SubscriptionInvoiceEntity[]>;
    getAllByOfficeId(officeId: string): Promise<SubscriptionInvoiceEntity[]>;
    findByInvoiceNumber(invoiceNumber: string): Promise<SubscriptionInvoiceRow | null>;
    getAllBySubscriptionId(subscriptionId: string): Promise<SubscriptionInvoiceRow[]>;
    findByPaymentTransactionId(paymentTransactionId: string): Promise<SubscriptionInvoiceRow | null>;
    findByGatewayInvoiceId(gatewayInvoiceId: string): Promise<SubscriptionInvoiceRow | null>;
    findLatestBySubscriptionId(subscriptionId: string): Promise<SubscriptionInvoiceRow | null>;
}
