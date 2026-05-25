import type { UserAccessCodeRow } from '../../../entities/user-access-codes-repository.interface';
export declare class GetAllUserAccessCodesByUserCustomerIdDtoOut {
    readonly items: UserAccessCodeRow[];
    readonly total: number;
    constructor(items: UserAccessCodeRow[], total: number);
}
