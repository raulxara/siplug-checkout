import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionInvoicesRepository } from './subscription-invoices-repository.interface';
export declare class SubscriptionInvoiceEntity extends AbstractEntity {
    private readonly repository;
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
    constructor(repository: ISubscriptionInvoicesRepository);
    create(): Promise<SubscriptionInvoiceEntity>;
}
