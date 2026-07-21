import { Inject, Injectable } from '@nestjs/common';
import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { USER_CUSTOMERS_REPOSITORY } from '../../tokens/user-customers.tokens';
import { GetAllUserCustomersByClientIdDtoIn } from './dtos/get-all-user-customers-by-client-id.dto-in';
import { GetAllUserCustomersByClientIdDtoOut } from './dtos/get-all-user-customers-by-client-id.dto-out';

@Injectable()
export class GetAllUserCustomersByClientIdService {
  constructor(
    @Inject(USER_CUSTOMERS_REPOSITORY)
    private readonly repository: IUserCustomersRepository,
  ) {}

  async exec(
    dtoIn: GetAllUserCustomersByClientIdDtoIn,
  ): Promise<GetAllUserCustomersByClientIdDtoOut> {
    try {
      const rows = await this.repository.getAllByClientId(dtoIn.clientId);

      return new GetAllUserCustomersByClientIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all user customers by client id';

      throw new Error(message);
    }
  }
}