import type { PermissionRow } from '../../../entities/permissions-repository.interface';
export declare class GetAllPermissionsDtoOut {
    readonly items: PermissionRow[];
    readonly total: number;
    constructor(items: PermissionRow[], total: number);
}
