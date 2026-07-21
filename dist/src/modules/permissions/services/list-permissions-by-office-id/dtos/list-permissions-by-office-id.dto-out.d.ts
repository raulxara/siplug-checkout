import type { PermissionRow } from '../../../entities/permissions-repository.interface';
export declare class ListPermissionsByOfficeIdDtoOut {
    readonly permissions: PermissionRow[];
    constructor(permissions: PermissionRow[]);
}
