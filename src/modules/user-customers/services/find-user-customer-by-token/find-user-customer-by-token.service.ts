import { Inject, Injectable } from '@nestjs/common';
import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { USER_CUSTOMERS_REPOSITORY } from '../../tokens/user-customers.tokens';
import { FindUserCustomerByTokenDtoIn } from './dtos/find-user-customer-by-token.dto-in';
import { FindUserCustomerByTokenDtoOut } from './dtos/find-user-customer-by-token.dto-out';

@Injectable()
export class FindUserCustomerByTokenService {
  constructor(
    @Inject(USER_CUSTOMERS_REPOSITORY)
    private readonly repository: IUserCustomersRepository,
  ) {}

  async exec(
    dtoIn: FindUserCustomerByTokenDtoIn,
  ): Promise<FindUserCustomerByTokenDtoOut> {
    try {
      const userCustomer = await this.repository.findByToken(dtoIn.token);

      if (!userCustomer) {
        throw new Error('user customer not found');
      }

      return new FindUserCustomerByTokenDtoOut(userCustomer);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find user customer by token';

      throw new Error(message);
    }
  }
}