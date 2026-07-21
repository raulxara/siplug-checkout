import type { UserPositionRow } from '../../../entities/user-positions-repository.interface';
export declare class GetAllUserPositionsByUserCustomerIdDtoOut {
    readonly items: UserPositionRow[];
    readonly total: number;
    constructor(items: UserPositionRow[], total: number);
}
