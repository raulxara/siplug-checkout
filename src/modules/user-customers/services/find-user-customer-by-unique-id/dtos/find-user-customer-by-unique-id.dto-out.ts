import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';

export class FindUserCustomerByUniqueIdDtoOut {
  constructor(public readonly userCustomer: UserCustomerRow) {}
}