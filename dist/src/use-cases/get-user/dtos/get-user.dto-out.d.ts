import type { ClientRow } from '../../../modules/clients/entities/clients-repository.interface';
import type { PositionRow } from '../../../modules/positions/entities/positions-repository.interface';
import type { ProfileRow } from '../../../modules/profiles/entities/profiles-repository.interface';
import type { UserAccessCodeRow } from '../../../modules/user-access-codes/entities/user-access-codes-repository.interface';
import type { UserCustomerRow } from '../../../modules/user-customers/entities/user-customers-repository.interface';
import type { UserPositionRow } from '../../../modules/user-positions/entities/user-positions-repository.interface';
export type SafeUserCustomerRow = Omit<UserCustomerRow, 'token'>;
export type SafeUserAccessCodeRow = Omit<UserAccessCodeRow, 'code'> & {
    codeHidden: boolean;
};
export declare class GetUserDtoOut {
    readonly profile: ProfileRow;
    readonly client: ClientRow;
    readonly userCustomer: SafeUserCustomerRow;
    readonly userPositions: UserPositionRow[];
    readonly positions: PositionRow[];
    readonly accessCodes: SafeUserAccessCodeRow[];
    constructor(profile: ProfileRow, client: ClientRow, userCustomer: SafeUserCustomerRow, userPositions: UserPositionRow[], positions: PositionRow[], accessCodes: SafeUserAccessCodeRow[]);
}
