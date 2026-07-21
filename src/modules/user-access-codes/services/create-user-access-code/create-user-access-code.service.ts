import { Inject, Injectable } from '@nestjs/common';
import { UserAccessCodeEntity } from '../../entities/user-access-code.entity';
import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { USER_ACCESS_CODES_REPOSITORY } from '../../tokens/user-access-codes.tokens';
import { CreateUserAccessCodeDtoIn } from './dtos/create-user-access-code.dto-in';
import { CreateUserAccessCodeDtoOut } from './dtos/create-user-access-code.dto-out';

@Injectable()
export class CreateUserAccessCodeService {
  constructor(
    @Inject(USER_ACCESS_CODES_REPOSITORY)
    private readonly repository: IUserAccessCodesRepository,
  ) {}

  async exec(
    dtoIn: CreateUserAccessCodeDtoIn,
  ): Promise<CreateUserAccessCodeDtoOut> {
    try {
      const entity = new UserAccessCodeEntity(this.repository);

      entity.userCustomerId = dtoIn.userCustomerId;
      entity.channel = dtoIn.channel;
      entity.destination = dtoIn.destination;
      entity.code = dtoIn.code;
      entity.expiresAt = dtoIn.expiresAt;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateUserAccessCodeDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create user access code';

      throw new Error(message);
    }
  }
}