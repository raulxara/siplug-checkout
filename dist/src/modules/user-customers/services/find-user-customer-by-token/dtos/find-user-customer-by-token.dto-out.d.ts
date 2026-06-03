import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';
export declare class FindUserCustomerByTokenDtoOut {
    readonly userCustomer: UserCustomerRow;
    constructor(userCustomer: UserCustomerRow);
}
