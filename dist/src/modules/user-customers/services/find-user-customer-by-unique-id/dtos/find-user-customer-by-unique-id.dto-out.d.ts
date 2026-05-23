import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';
export declare class FindUserCustomerByUniqueIdDtoOut {
    readonly userCustomer: UserCustomerRow;
    constructor(userCustomer: UserCustomerRow);
}
