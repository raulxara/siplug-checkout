import type { PositionRow } from '../../../entities/positions-repository.interface';

export class GetAllPositionsByUniqueIdsDtoOut {
  constructor(
    public readonly items: PositionRow[],
    public readonly total: number,
  ) {}
}