import { Inject, Injectable } from '@nestjs/common';
import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { USER_ACCESS_CODES_REPOSITORY } from '../../tokens/user-access-codes.tokens';
import { FindUserAccessCodeByUniqueIdDtoIn } from './dtos/find-user-access-code-by-unique-id.dto-in';
import { FindUserAccessCodeByUniqueIdDtoOut } from './dtos/find-user-access-code-by-unique-id.dto-out';

@Injectable()
export class FindUserAccessCodeByUniqueIdService {
  constructor(
    @Inject(USER_ACCESS_CODES_REPOSITORY)
    private readonly repository: IUserAccessCodesRepository,
  ) {}

  async exec(
    dtoIn: FindUserAccessCodeByUniqueIdDtoIn,
  ): Promise<FindUserAccessCodeByUniqueIdDtoOut> {
    try {
      const userAccessCode = await this.repository.findByUniqueId(dtoIn._id);

      if (!userAccessCode) {
        throw new Error('user access code not found');
      }

      return new FindUserAccessCodeByUniqueIdDtoOut(userAccessCode);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find user access code by unique id';

      throw new Error(message);
    }
  }
}