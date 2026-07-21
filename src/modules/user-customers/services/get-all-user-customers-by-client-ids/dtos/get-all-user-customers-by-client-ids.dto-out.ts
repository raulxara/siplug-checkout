import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';

export class GetAllUserCustomersByClientIdsDtoOut {
  constructor(
    public readonly items: UserCustomerRow[],
    public readonly total: number,
  ) {}
}