import { Inject, Injectable } from '@nestjs/common';
import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { USER_CUSTOMERS_REPOSITORY } from '../../tokens/user-customers.tokens';
import { GetAllUserCustomersByClientIdsDtoIn } from './dtos/get-all-user-customers-by-client-ids.dto-in';
import { GetAllUserCustomersByClientIdsDtoOut } from './dtos/get-all-user-customers-by-client-ids.dto-out';

@Injectable()
export class GetAllUserCustomersByClientIdsService {
  constructor(
    @Inject(USER_CUSTOMERS_REPOSITORY)
    private readonly repository: IUserCustomersRepository,
  ) {}

  async exec(
    dtoIn: GetAllUserCustomersByClientIdsDtoIn,
  ): Promise<GetAllUserCustomersByClientIdsDtoOut> {
    try {
      const rows = await this.repository.getAllByClientIds(dtoIn.clientIds);

      return new GetAllUserCustomersByClientIdsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all user customers by client ids';

      throw new Error(message);
    }
  }
}