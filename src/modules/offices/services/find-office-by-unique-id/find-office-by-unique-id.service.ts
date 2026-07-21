import { Inject, Injectable } from '@nestjs/common';
import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { OFFICES_REPOSITORY } from '../../tokens/offices.tokens';
import { FindOfficeByUniqueIdDtoIn } from './dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdDtoOut } from './dtos/find-office-by-unique-id.dto-out';

@Injectable()
export class FindOfficeByUniqueIdService {
  constructor(
    @Inject(OFFICES_REPOSITORY)
    private readonly repository: IOfficesRepository,
  ) {}

  async exec(
    dtoIn: FindOfficeByUniqueIdDtoIn,
  ): Promise<FindOfficeByUniqueIdDtoOut> {
    try {
      const office = await this.repository.findByUniqueId(dtoIn._id);

      if (!office) {
        throw new Error('office not found');
      }

      return new FindOfficeByUniqueIdDtoOut(office);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find office';

      throw new Error(message);
    }
  }
}