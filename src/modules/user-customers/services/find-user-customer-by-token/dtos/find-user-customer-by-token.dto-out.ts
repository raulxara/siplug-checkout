import type { UserCustomerRow } from '../../../entities/user-customers-repository.interface';

export class FindUserCustomerByTokenDtoOut {
  constructor(public readonly userCustomer: UserCustomerRow) {}
}