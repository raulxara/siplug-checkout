import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';
export declare class GetAllUserCustomersDtoOut {
    readonly items: UserCustomerRow[];
    readonly total: number;
    constructor(items: UserCustomerRow[], total: number);
}
