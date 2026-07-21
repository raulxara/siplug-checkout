import type { PermissionRow } from '../../../../permissions/entities/permissions-repository.interface';
import type { PositionRow } from '../../../../positions/entities/positions-repository.interface';
import type { UserCustomerRow } from '../../../../user-customers/entities/user-customers-repository.interface';

export class ResolveActorAuthorizationDtoOut {
  constructor(
    public readonly allowed: boolean,
    public readonly isAdministrator: boolean,
    public readonly requiredAction: string,
    public readonly requiredEntity: string | null,
    public readonly actor: UserCustomerRow,
    public readonly positions: PositionRow[],
    public readonly permissions: PermissionRow[],
    public readonly matchedPermission: PermissionRow | null,
  ) {}
}