import type { ClientRow } from '../../../modules/clients/entities/clients-repository.interface';
import type { ProfileRow } from '../../../modules/profiles/entities/profiles-repository.interface';
import type { UserAccessCodeRow } from '../../../modules/user-access-codes/entities/user-access-codes-repository.interface';
import type { UserCustomerRow } from '../../../modules/user-customers/entities/user-customers-repository.interface';
import type { UserPositionRow } from '../../../modules/user-positions/entities/user-positions-repository.interface';

export class RegisterUserDtoOut {
  constructor(
    public readonly profile: ProfileRow,
    public readonly client: ClientRow,
    public readonly userCustomer: UserCustomerRow,
    public readonly userPosition: UserPositionRow,
    public readonly accessCodes: UserAccessCodeRow[],
  ) {}
}