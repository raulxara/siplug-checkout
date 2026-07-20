import type { PositionRow } from '../../../entities/positions-repository.interface';
export declare class ListPositionsByOfficeIdDtoOut {
    readonly positions: PositionRow[];
    constructor(positions: PositionRow[]);
}
