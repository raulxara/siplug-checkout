import type { PositionRow } from '../../../entities/positions-repository.interface';
export declare class GetAllPositionsDtoOut {
    readonly items: PositionRow[];
    readonly total: number;
    constructor(items: PositionRow[], total: number);
}
