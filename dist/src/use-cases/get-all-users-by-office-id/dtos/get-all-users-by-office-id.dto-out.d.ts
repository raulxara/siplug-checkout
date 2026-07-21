import type { ClientRow } from '../../../modules/clients/entities/clients-repository.interface';
import type { PositionRow } from '../../../modules/positions/entities/positions-repository.interface';
import type { ProfileRow } from '../../../modules/profiles/entities/profiles-repository.interface';
import type { UserCustomerRow } from '../../../modules/user-customers/entities/user-customers-repository.interface';
import type { UserPositionRow } from '../../../modules/user-positions/entities/user-positions-repository.interface';
export type SafeOfficeUserCustomerRow = Omit<UserCustomerRow, 'token'>;
export type GetAllUsersByOfficeIdItem = {
    profile: ProfileRow;
    client: ClientRow;
    userCustomer: SafeOfficeUserCustomerRow;
    userPositions: UserPositionRow[];
    positions: PositionRow[];
};
export declare class GetAllUsersByOfficeIdDtoOut {
    readonly officeId: string;
    readonly items: GetAllUsersByOfficeIdItem[];
    readonly total: number;
    readonly page: number;
    readonly perPage: number;
    readonly totalPages: number;
    constructor(officeId: string, items: GetAllUsersByOfficeIdItem[], total: number, page: number, perPage: number, totalPages: number);
}
