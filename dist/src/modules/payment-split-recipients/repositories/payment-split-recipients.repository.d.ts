import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentSplitRecipientEntity } from '../entities/payment-split-recipient.entity';
import type { IPaymentSplitRecipientsRepository, PaymentSplitRecipientRow } from '../entities/payment-split-recipients-repository.interface';
export declare class PaymentSplitRecipientsRepository implements IPaymentSplitRecipientsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PaymentSplitRecipientEntity): Promise<PaymentSplitRecipientEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentSplitRecipientRow>;
    getAllByPaymentSplitId(paymentSplitId: string): Promise<PaymentSplitRecipientRow[]>;
    findByUniqueId(_id: string): Promise<PaymentSplitRecipientRow | null>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
