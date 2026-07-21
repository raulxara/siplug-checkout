import type { UserPositionRow } from '../../../entities/user-positions-repository.interface';

export class FindUserPositionByUniqueIdDtoOut {
  constructor(public readonly userPosition: UserPositionRow) {}
}