import { Inject, Injectable } from '@nestjs/common';
import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { USER_ACCESS_CODES_REPOSITORY } from '../../tokens/user-access-codes.tokens';
import { FindUserAccessCodeByCodeDtoIn } from './dtos/find-user-access-code-by-code.dto-in';
import { FindUserAccessCodeByCodeDtoOut } from './dtos/find-user-access-code-by-code.dto-out';

@Injectable()
export class FindUserAccessCodeByCodeService {
  constructor(
    @Inject(USER_ACCESS_CODES_REPOSITORY)
    private readonly repository: IUserAccessCodesRepository,
  ) {}

  async exec(
    dtoIn: FindUserAccessCodeByCodeDtoIn,
  ): Promise<FindUserAccessCodeByCodeDtoOut> {
    try {
      const userAccessCode = await this.repository.findByCode(dtoIn.code);

      if (!userAccessCode) {
        throw new Error('user access code not found');
      }

      return new FindUserAccessCodeByCodeDtoOut(userAccessCode);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find user access code by code';

      throw new Error(message);
    }
  }
}