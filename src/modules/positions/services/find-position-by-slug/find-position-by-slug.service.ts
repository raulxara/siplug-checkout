import { Inject, Injectable } from '@nestjs/common';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { FindPositionBySlugDtoIn } from './dtos/find-position-by-slug.dto-in';
import { FindPositionBySlugDtoOut } from './dtos/find-position-by-slug.dto-out';

@Injectable()
export class FindPositionBySlugService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
  ) {}

  async exec(dtoIn: FindPositionBySlugDtoIn): Promise<FindPositionBySlugDtoOut> {
    try {
      const position = await this.repository.findBySlug(
        dtoIn.officeId,
        dtoIn.slug,
      );

      if (!position) {
        throw new Error('position not found');
      }

      return new FindPositionBySlugDtoOut(position);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find position by slug';

      throw new Error(message);
    }
  }
}