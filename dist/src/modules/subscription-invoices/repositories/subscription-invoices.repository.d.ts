import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionInvoiceEntity } from '../entities/subscription-invoice.entity';
import type { ISubscriptionInvoicesRepository, SubscriptionInvoiceRow } from '../entities/subscription-invoices-repository.interface';
export declare class SubscriptionInvoicesRepository implements ISubscriptionInvoicesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: SubscriptionInvoiceEntity): Promise<SubscriptionInvoiceEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SubscriptionInvoiceRow>;
    getAll(): Promise<SubscriptionInvoiceEntity[]>;
    getAllByOfficeId(officeId: string): Promise<SubscriptionInvoiceEntity[]>;
    findByUniqueId(_id: string): Promise<SubscriptionInvoiceRow | null>;
    findByInvoiceNumber(invoiceNumber: string): Promise<SubscriptionInvoiceRow | null>;
    getAllBySubscriptionId(subscriptionId: string): Promise<SubscriptionInvoiceRow[]>;
    private hydrateEntityFromModel;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
    private toNullableDate;
}
