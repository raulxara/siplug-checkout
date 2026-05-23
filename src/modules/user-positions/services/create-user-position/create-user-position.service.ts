import { Inject, Injectable } from '@nestjs/common';
import { UserPositionEntity } from '../../entities/user-position.entity';
import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { USER_POSITIONS_REPOSITORY } from '../../tokens/user-positions.tokens';
import { CreateUserPositionDtoIn } from './dtos/create-user-position.dto-in';
import { CreateUserPositionDtoOut } from './dtos/create-user-position.dto-out';

@Injectable()
export class CreateUserPositionService {
  constructor(
    @Inject(USER_POSITIONS_REPOSITORY)
    private readonly repository: IUserPositionsRepository,
  ) {}

  async exec(dtoIn: CreateUserPositionDtoIn): Promise<CreateUserPositionDtoOut> {
    try {
      const entity = new UserPositionEntity(this.repository);

      entity.userCustomerId = dtoIn.userCustomerId;
      entity.positionId = dtoIn.positionId;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateUserPositionDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create user position';

      throw new Error(message);
    }
  }
}