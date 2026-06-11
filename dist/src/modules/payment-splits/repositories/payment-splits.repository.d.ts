import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentSplitEntity } from '../entities/payment-split.entity';
import type { IPaymentSplitsRepository, PaymentSplitRow } from '../entities/payment-splits-repository.interface';
export declare class PaymentSplitsRepository implements IPaymentSplitsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PaymentSplitEntity): Promise<PaymentSplitEntity>;
    getAllByOfficeId(officeId: string): Promise<PaymentSplitRow[]>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentSplitRow>;
    findByUniqueId(_id: string): Promise<PaymentSplitRow | null>;
    getAllByPaymentTransactionId(paymentTransactionId: string): Promise<PaymentSplitRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
