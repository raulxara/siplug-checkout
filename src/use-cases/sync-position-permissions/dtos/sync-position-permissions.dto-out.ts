import type { PermissionRow } from '../../../modules/permissions/entities/permissions-repository.interface';
import type { PositionPermissionRow } from '../../../modules/position-permissions/entities/position-permissions-repository.interface';
import type { PositionRow } from '../../../modules/positions/entities/positions-repository.interface';

export class SyncPositionPermissionsDtoOut {
  constructor(
    public readonly position: PositionRow,
    public readonly permissions: PermissionRow[],
    public readonly requestedPermissionIds: string[],
    public readonly created: PositionPermissionRow[],
    public readonly activated: PositionPermissionRow[],
    public readonly inactivated: PositionPermissionRow[],
    public readonly kept: PositionPermissionRow[],
    public readonly totalRequested: number,
    public readonly totalCreated: number,
    public readonly totalActivated: number,
    public readonly totalInactivated: number,
    public readonly totalKept: number,
  ) {}
}