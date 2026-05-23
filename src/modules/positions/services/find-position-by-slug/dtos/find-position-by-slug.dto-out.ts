import type { PositionRow } from '../../../entities/positions-repository.interface';

export class FindPositionBySlugDtoOut {
  constructor(public readonly position: PositionRow) {}
}