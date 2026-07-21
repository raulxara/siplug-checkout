import type { ClientRow } from '../../../modules/clients/entities/clients-repository.interface';
import type { ProfileRow } from '../../../modules/profiles/entities/profiles-repository.interface';
import type { UserCustomerRow } from '../../../modules/user-customers/entities/user-customers-repository.interface';
import type { UserPositionRow } from '../../../modules/user-positions/entities/user-positions-repository.interface';
export declare class UpdateUserDtoOut {
    readonly profile: ProfileRow;
    readonly client: ClientRow;
    readonly userCustomer: UserCustomerRow;
    readonly userPositions: UserPositionRow[];
    readonly createdUserPositions: UserPositionRow[];
    readonly activatedUserPositions: UserPositionRow[];
    readonly inactivatedUserPositions: UserPositionRow[];
    constructor(profile: ProfileRow, client: ClientRow, userCustomer: UserCustomerRow, userPositions: UserPositionRow[], createdUserPositions: UserPositionRow[], activatedUserPositions: UserPositionRow[], inactivatedUserPositions: UserPositionRow[]);
}
