import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserPositionEntity } from '../entities/user-position.entity';
import type { IUserPositionsRepository, UserPositionRow } from '../entities/user-positions-repository.interface';
export declare class UserPositionsRepository implements IUserPositionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: UserPositionEntity): Promise<UserPositionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<UserPositionRow>;
    findByUniqueId(_id: string): Promise<UserPositionRow | null>;
    findByUserCustomerAndPosition(userCustomerId: string, positionId: string): Promise<UserPositionRow | null>;
    getAll(): Promise<UserPositionRow[]>;
    getAllByUserCustomerId(userCustomerId: string): Promise<UserPositionRow[]>;
    getAllByUserCustomerIds(userCustomerIds: string[]): Promise<UserPositionRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
