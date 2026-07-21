import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserAccessCodeEntity } from '../entities/user-access-code.entity';
import type { IUserAccessCodesRepository, UserAccessCodeRow } from '../entities/user-access-codes-repository.interface';
export declare class UserAccessCodesRepository implements IUserAccessCodesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: UserAccessCodeEntity): Promise<UserAccessCodeEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<UserAccessCodeRow>;
    findByUniqueId(_id: string): Promise<UserAccessCodeRow | null>;
    findByCode(code: string): Promise<UserAccessCodeRow | null>;
    getAllByUserCustomerId(userCustomerId: string): Promise<UserAccessCodeRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
