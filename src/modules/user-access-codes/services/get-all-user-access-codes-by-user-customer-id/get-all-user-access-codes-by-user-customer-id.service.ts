import { Inject, Injectable } from '@nestjs/common';
import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { USER_ACCESS_CODES_REPOSITORY } from '../../tokens/user-access-codes.tokens';
import { GetAllUserAccessCodesByUserCustomerIdDtoIn } from './dtos/get-all-user-access-codes-by-user-customer-id.dto-in';
import { GetAllUserAccessCodesByUserCustomerIdDtoOut } from './dtos/get-all-user-access-codes-by-user-customer-id.dto-out';

@Injectable()
export class GetAllUserAccessCodesByUserCustomerIdService {
  constructor(
    @Inject(USER_ACCESS_CODES_REPOSITORY)
    private readonly repository: IUserAccessCodesRepository,
  ) {}

  async exec(
    dtoIn: GetAllUserAccessCodesByUserCustomerIdDtoIn,
  ): Promise<GetAllUserAccessCodesByUserCustomerIdDtoOut> {
    try {
      const rows = await this.repository.getAllByUserCustomerId(
        dtoIn.userCustomerId,
      );

      return new GetAllUserAccessCodesByUserCustomerIdDtoOut(
        rows,
        rows.length,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all user access codes by user customer id';

      throw new Error(message);
    }
  }
}