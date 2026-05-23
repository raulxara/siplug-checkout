import type { PermissionRow } from '../../../../permissions/entities/permissions-repository.interface';
import type { PositionRow } from '../../../../positions/entities/positions-repository.interface';
import type { UserCustomerRow } from '../../../../user-customers/entities/user-customers-repository.interface';
export declare class ResolveActorAuthorizationDtoOut {
    readonly allowed: boolean;
    readonly isAdministrator: boolean;
    readonly requiredAction: string;
    readonly requiredEntity: string | null;
    readonly actor: UserCustomerRow;
    readonly positions: PositionRow[];
    readonly permissions: PermissionRow[];
    readonly matchedPermission: PermissionRow | null;
    constructor(allowed: boolean, isAdministrator: boolean, requiredAction: string, requiredEntity: string | null, actor: UserCustomerRow, positions: PositionRow[], permissions: PermissionRow[], matchedPermission: PermissionRow | null);
}
