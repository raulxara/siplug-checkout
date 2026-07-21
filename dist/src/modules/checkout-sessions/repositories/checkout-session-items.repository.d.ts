import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { CheckoutSessionItemEntity } from '../entities/checkout-session-item.entity';
import type { CheckoutSessionItemRow, ICheckoutSessionItemsRepository } from '../entities/checkout-session-items-repository.interface';
export declare class CheckoutSessionItemsRepository implements ICheckoutSessionItemsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: CheckoutSessionItemEntity): Promise<CheckoutSessionItemEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<CheckoutSessionItemRow>;
    findByUniqueId(_id: string): Promise<CheckoutSessionItemRow | null>;
    getAllByCheckoutSessionId(checkoutSessionId: string): Promise<CheckoutSessionItemRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
