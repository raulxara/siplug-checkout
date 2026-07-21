import type { UserPositionRow } from '../../../entities/user-positions-repository.interface';

export class GetAllUserPositionsByUserCustomerIdDtoOut {
  constructor(
    public readonly items: UserPositionRow[],
    public readonly total: number,
  ) {}
}