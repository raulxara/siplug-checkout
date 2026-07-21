import { Inject, Injectable } from '@nestjs/common';
import { UserCustomerEntity } from '../../entities/user-customer.entity';
import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { USER_CUSTOMERS_REPOSITORY } from '../../tokens/user-customers.tokens';
import { CreateUserCustomerDtoIn } from './dtos/create-user-customer.dto-in';
import { CreateUserCustomerDtoOut } from './dtos/create-user-customer.dto-out';

@Injectable()
export class CreateUserCustomerService {
  constructor(
    @Inject(USER_CUSTOMERS_REPOSITORY)
    private readonly repository: IUserCustomersRepository,
  ) {}

  async exec(
    dtoIn: CreateUserCustomerDtoIn,
  ): Promise<CreateUserCustomerDtoOut> {
    try {
      const entity = new UserCustomerEntity(this.repository);

      entity.clientId = dtoIn.clientId;
      entity.profileId = dtoIn.profileId;
      entity.token = dtoIn.token;
      entity.twoFaRequired = dtoIn.twoFaRequired;
      entity.twoFaActive = dtoIn.twoFaActive;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateUserCustomerDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create user customer';

      throw new Error(message);
    }
  }
}