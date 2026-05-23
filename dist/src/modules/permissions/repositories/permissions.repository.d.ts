import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PermissionEntity } from '../entities/permission.entity';
import type { IPermissionsRepository, PermissionRow } from '../entities/permissions-repository.interface';
export declare class PermissionsRepository implements IPermissionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PermissionEntity): Promise<PermissionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PermissionRow>;
    findByUniqueId(_id: string): Promise<PermissionRow | null>;
    findBySlug(officeId: string | null, slug: string): Promise<PermissionRow | null>;
    getAll(): Promise<PermissionRow[]>;
    getAllByOfficeId(officeId: string): Promise<PermissionRow[]>;
    getAllByUniqueIds(_ids: string[]): Promise<PermissionRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
