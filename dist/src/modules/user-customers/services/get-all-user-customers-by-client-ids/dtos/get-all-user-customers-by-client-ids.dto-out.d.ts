import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';
export declare class GetAllUserCustomersByClientIdsDtoOut {
    readonly items: UserCustomerRow[];
    readonly total: number;
    constructor(items: UserCustomerRow[], total: number);
}
