import type { PositionPermissionRow } from '../../../entities/position-permissions-repository.interface';
export declare class GetAllPositionPermissionsDtoOut {
    readonly items: PositionPermissionRow[];
    readonly total: number;
    constructor(items: PositionPermissionRow[], total: number);
}
