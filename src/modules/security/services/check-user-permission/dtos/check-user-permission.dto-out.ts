import type { PermissionRow } from '../../../../permissions/entities/permissions-repository.interface';
import type { PositionRow } from '../../../../positions/entities/positions-repository.interface';
import type { PositionPermissionRow } from '../../../../position-permissions/entities/position-permissions-repository.interface';
import type { UserPositionRow } from '../../../../user-positions/entities/user-positions-repository.interface';

export class CheckUserPermissionDtoOut {
  constructor(
    public readonly allowed: boolean,
    public readonly isAdministrator: boolean,
    public readonly requiredAction: string,
    public readonly requiredEntity: string | null,
    public readonly positions: PositionRow[],
    public readonly userPositions: UserPositionRow[],
    public readonly positionPermissions: PositionPermissionRow[],
    public readonly permissions: PermissionRow[],
    public readonly matchedPermission: PermissionRow | null,
  ) {}
}