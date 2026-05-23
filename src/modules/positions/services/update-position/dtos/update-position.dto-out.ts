import type { PositionRow } from '../../../entities/positions-repository.interface';

export class UpdatePositionDtoOut {
  constructor(public readonly position: PositionRow) {}
}