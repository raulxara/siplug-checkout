import { Inject, Injectable } from '@nestjs/common';
import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { USER_CUSTOMERS_REPOSITORY } from '../../tokens/user-customers.tokens';
import { FindUserCustomerByUniqueIdDtoIn } from './dtos/find-user-customer-by-unique-id.dto-in';
import { FindUserCustomerByUniqueIdDtoOut } from './dtos/find-user-customer-by-unique-id.dto-out';

@Injectable()
export class FindUserCustomerByUniqueIdService {
  constructor(
    @Inject(USER_CUSTOMERS_REPOSITORY)
    private readonly repository: IUserCustomersRepository,
  ) {}

  async exec(
    dtoIn: FindUserCustomerByUniqueIdDtoIn,
  ): Promise<FindUserCustomerByUniqueIdDtoOut> {
    try {
      const userCustomer = await this.repository.findByUniqueId(dtoIn._id);

      if (!userCustomer) {
        throw new Error('user customer not found');
      }

      return new FindUserCustomerByUniqueIdDtoOut(userCustomer);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find user customer';

      throw new Error(message);
    }
  }
}