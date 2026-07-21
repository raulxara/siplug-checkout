import type { PositionPermissionRow } from '../../../entities/position-permissions-repository.interface';
export declare class GetAllPositionPermissionsByPositionIdDtoOut {
    readonly items: PositionPermissionRow[];
    readonly total: number;
    constructor(items: PositionPermissionRow[], total: number);
}
