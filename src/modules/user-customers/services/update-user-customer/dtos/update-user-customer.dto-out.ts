import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';

export class UpdateUserCustomerDtoOut {
  constructor(public readonly userCustomer: UserCustomerRow) {}
}