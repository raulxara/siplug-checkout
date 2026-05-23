import { Inject, Injectable } from '@nestjs/common';
import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { OFFICES_REPOSITORY } from '../../tokens/offices.tokens';
import { FindOfficeBySlugDtoIn } from './dtos/find-office-by-slug.dto-in';
import { FindOfficeBySlugDtoOut } from './dtos/find-office-by-slug.dto-out';

@Injectable()
export class FindOfficeBySlugService {
  constructor(
    @Inject(OFFICES_REPOSITORY)
    private readonly repository: IOfficesRepository,
  ) {}

  async exec(dtoIn: FindOfficeBySlugDtoIn): Promise<FindOfficeBySlugDtoOut> {
    try {
      const office = await this.repository.findBySlug(dtoIn.slug);

      if (!office) {
        throw new Error('office not found');
      }

      return new FindOfficeBySlugDtoOut(office);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find office by slug';

      throw new Error(message);
    }
  }
}