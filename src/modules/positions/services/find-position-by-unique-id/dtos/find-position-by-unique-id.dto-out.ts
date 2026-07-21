import type { PositionRow } from '../../../entities/positions-repository.interface';

export class FindPositionByUniqueIdDtoOut {
  constructor(public readonly position: PositionRow) {}
}