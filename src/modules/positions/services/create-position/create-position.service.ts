import { Inject, Injectable } from '@nestjs/common';
import { PositionEntity } from '../../entities/position.entity';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { CreatePositionDtoIn } from './dtos/create-position.dto-in';
import { CreatePositionDtoOut } from './dtos/create-position.dto-out';

@Injectable()
export class CreatePositionService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
  ) {}

  async exec(dtoIn: CreatePositionDtoIn): Promise<CreatePositionDtoOut> {
    try {
      const entity = new PositionEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.name = dtoIn.name;
      entity.slug = dtoIn.slug;
      entity.description = dtoIn.description;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreatePositionDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on create position';

      throw new Error(message);
    }
  }
}