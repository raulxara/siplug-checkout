import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';

export class GetAllUserCustomersDtoOut {
  constructor(
    public readonly items: UserCustomerRow[],
    public readonly total: number,
  ) {}
}