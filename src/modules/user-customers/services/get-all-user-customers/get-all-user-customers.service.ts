import { Inject, Injectable } from '@nestjs/common';
import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { USER_CUSTOMERS_REPOSITORY } from '../../tokens/user-customers.tokens';
import { GetAllUserCustomersDtoIn } from './dtos/get-all-user-customers.dto-in';
import { GetAllUserCustomersDtoOut } from './dtos/get-all-user-customers.dto-out';

@Injectable()
export class GetAllUserCustomersService {
  constructor(
    @Inject(USER_CUSTOMERS_REPOSITORY)
    private readonly repository: IUserCustomersRepository,
  ) {}

  async exec(
    dtoIn: GetAllUserCustomersDtoIn,
  ): Promise<GetAllUserCustomersDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllUserCustomersDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all user customers';

      throw new Error(message);
    }
  }
}