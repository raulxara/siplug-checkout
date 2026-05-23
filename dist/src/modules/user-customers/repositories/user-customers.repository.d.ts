import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserCustomerEntity } from '../entities/user-customer.entity';
import type { IUserCustomersRepository, UserCustomerRow } from '../entities/user-customers-repository.interface';
export declare class UserCustomersRepository implements IUserCustomersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: UserCustomerEntity): Promise<UserCustomerEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<UserCustomerRow>;
    findByUniqueId(_id: string): Promise<UserCustomerRow | null>;
    findByToken(token: string): Promise<UserCustomerRow | null>;
    getAll(): Promise<UserCustomerRow[]>;
    getAllByClientId(clientId: string): Promise<UserCustomerRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
