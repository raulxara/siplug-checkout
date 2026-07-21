import type { PermissionEntity } from './permission.entity';
export type PermissionRow = {
    id: number;
    _id: string;
    officeId: string | null;
    name: string;
    slug: string;
    description: string | null;
    entity: string;
    action: string;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IPermissionsRepository {
    create(entity: PermissionEntity): Promise<PermissionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PermissionRow>;
    findByUniqueId(_id: string): Promise<PermissionRow | null>;
    findBySlug(officeId: string | null, slug: string): Promise<PermissionRow | null>;
    getAll(): Promise<PermissionRow[]>;
    getAllByOfficeId(officeId: string): Promise<PermissionRow[]>;
    getAllByUniqueIds(_ids: string[]): Promise<PermissionRow[]>;
}
