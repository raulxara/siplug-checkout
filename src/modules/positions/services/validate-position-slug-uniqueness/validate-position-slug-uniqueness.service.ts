import { Inject, Injectable } from '@nestjs/common';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { ValidatePositionSlugUniquenessDtoIn } from './dtos/validate-position-slug-uniqueness.dto-in';

@Injectable()
export class ValidatePositionSlugUniquenessService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
  ) {}

  async exec(dtoIn: ValidatePositionSlugUniquenessDtoIn): Promise<void> {
    try {
      const position = await this.repository.findBySlug(
        dtoIn.officeId,
        dtoIn.slug,
      );

      if (position) {
        throw new Error('position slug already exists');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on validate position slug uniqueness';

      throw new Error(message);
    }
  }
}