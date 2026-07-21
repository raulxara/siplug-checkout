import type { PermissionRow } from '../../../entities/permissions-repository.interface';
export declare class GetAllPermissionsByOfficeIdDtoOut {
    readonly items: PermissionRow[];
    readonly total: number;
    constructor(items: PermissionRow[], total: number);
}
