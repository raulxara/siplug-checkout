import type { UserPositionRow } from '../../../entities/user-positions-repository.interface';

export class UpdateUserPositionDtoOut {
  constructor(public readonly userPosition: UserPositionRow) {}
}