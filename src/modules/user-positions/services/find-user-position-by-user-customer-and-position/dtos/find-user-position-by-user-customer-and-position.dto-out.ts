import type { UserPositionRow } from '../../../entities/user-positions-repository.interface';

export class FindUserPositionByUserCustomerAndPositionDtoOut {
  constructor(public readonly userPosition: UserPositionRow) {}
}