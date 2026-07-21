import type { PositionRow } from '../../../entities/positions-repository.interface';

export class ListPositionsByOfficeIdDtoOut {
  constructor(public readonly positions: PositionRow[]) {}
}
