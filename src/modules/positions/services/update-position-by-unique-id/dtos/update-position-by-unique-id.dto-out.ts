import type { PositionRow } from '../../../entities/positions-repository.interface';

export class UpdatePositionByUniqueIdDtoOut {
  constructor(public readonly position: PositionRow) {}
}
