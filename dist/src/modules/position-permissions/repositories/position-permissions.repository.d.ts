import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PositionPermissionEntity } from '../entities/position-permission.entity';
import type { IPositionPermissionsRepository, PositionPermissionRow } from '../entities/position-permissions-repository.interface';
export declare class PositionPermissionsRepository implements IPositionPermissionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PositionPermissionEntity): Promise<PositionPermissionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PositionPermissionRow>;
    findByUniqueId(_id: string): Promise<PositionPermissionRow | null>;
    findByPositionAndPermission(positionId: string, permissionId: string): Promise<PositionPermissionRow | null>;
    getAll(): Promise<PositionPermissionRow[]>;
    getAllByPositionId(positionId: string): Promise<PositionPermissionRow[]>;
    getAllByPositionIds(positionIds: string[]): Promise<PositionPermissionRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
