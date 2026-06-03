import type { PermissionRow } from '../../../../permissions/entities/permissions-repository.interface';
import type { PositionRow } from '../../../../positions/entities/positions-repository.interface';
import type { PositionPermissionRow } from '../../../../position-permissions/entities/position-permissions-repository.interface';
import type { UserPositionRow } from '../../../../user-positions/entities/user-positions-repository.interface';
export declare class CheckUserPermissionDtoOut {
    readonly allowed: boolean;
    readonly isAdministrator: boolean;
    readonly requiredAction: string;
    readonly requiredEntity: string | null;
    readonly positions: PositionRow[];
    readonly userPositions: UserPositionRow[];
    readonly positionPermissions: PositionPermissionRow[];
    readonly permissions: PermissionRow[];
    readonly matchedPermission: PermissionRow | null;
    constructor(allowed: boolean, isAdministrator: boolean, requiredAction: string, requiredEntity: string | null, positions: PositionRow[], userPositions: UserPositionRow[], positionPermissions: PositionPermissionRow[], permissions: PermissionRow[], matchedPermission: PermissionRow | null);
}
