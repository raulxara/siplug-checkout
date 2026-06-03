import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { CheckoutSessionEntity } from '../entities/checkout-session.entity';
import type { CheckoutSessionRow, ICheckoutSessionsRepository } from '../entities/checkout-sessions-repository.interface';
export declare class CheckoutSessionsRepository implements ICheckoutSessionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: CheckoutSessionEntity): Promise<CheckoutSessionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<CheckoutSessionRow>;
    findByUniqueId(_id: string): Promise<CheckoutSessionRow | null>;
    getAll(): Promise<CheckoutSessionRow[]>;
    getAllByOfficeId(officeId: string): Promise<CheckoutSessionRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
