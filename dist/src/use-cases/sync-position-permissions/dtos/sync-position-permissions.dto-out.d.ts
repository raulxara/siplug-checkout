import type { PermissionRow } from '../../../modules/permissions/entities/permissions-repository.interface';
import type { PositionPermissionRow } from '../../../modules/position-permissions/entities/position-permissions-repository.interface';
import type { PositionRow } from '../../../modules/positions/entities/positions-repository.interface';
export declare class SyncPositionPermissionsDtoOut {
    readonly position: PositionRow;
    readonly permissions: PermissionRow[];
    readonly requestedPermissionIds: string[];
    readonly created: PositionPermissionRow[];
    readonly activated: PositionPermissionRow[];
    readonly inactivated: PositionPermissionRow[];
    readonly kept: PositionPermissionRow[];
    readonly totalRequested: number;
    readonly totalCreated: number;
    readonly totalActivated: number;
    readonly totalInactivated: number;
    readonly totalKept: number;
    constructor(position: PositionRow, permissions: PermissionRow[], requestedPermissionIds: string[], created: PositionPermissionRow[], activated: PositionPermissionRow[], inactivated: PositionPermissionRow[], kept: PositionPermissionRow[], totalRequested: number, totalCreated: number, totalActivated: number, totalInactivated: number, totalKept: number);
}
