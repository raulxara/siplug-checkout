import type { PositionRow } from '../../../entities/positions-repository.interface';

export class GetAllPositionsDtoOut {
  constructor(
    public readonly items: PositionRow[],
    public readonly total: number,
  ) {}
}