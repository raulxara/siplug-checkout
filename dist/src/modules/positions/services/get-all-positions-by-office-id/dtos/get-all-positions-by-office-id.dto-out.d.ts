import type { PositionRow } from '../../../entities/positions-repository.interface';
export declare class GetAllPositionsByOfficeIdDtoOut {
    readonly items: PositionRow[];
    readonly total: number;
    constructor(items: PositionRow[], total: number);
}
