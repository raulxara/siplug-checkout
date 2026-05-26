import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentTransactionEntity } from '../entities/payment-transaction.entity';
import type { IPaymentTransactionsRepository, PaymentTransactionRow } from '../entities/payment-transactions-repository.interface';
export declare class PaymentTransactionsRepository implements IPaymentTransactionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PaymentTransactionEntity): Promise<PaymentTransactionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentTransactionRow>;
    findByUniqueId(_id: string): Promise<PaymentTransactionRow | null>;
    getAll(): Promise<PaymentTransactionRow[]>;
    getAllByOfficeId(officeId: string): Promise<PaymentTransactionRow[]>;
    getAllByCheckoutSessionId(checkoutSessionId: string): Promise<PaymentTransactionRow[]>;
    private hydrateEntityFromModel;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
