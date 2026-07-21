import { Inject, Injectable } from '@nestjs/common';
import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { OFFICES_REPOSITORY } from '../../tokens/offices.tokens';
import { GetAllOfficesDtoIn } from './dtos/get-all-offices.dto-in';
import { GetAllOfficesDtoOut } from './dtos/get-all-offices.dto-out';

@Injectable()
export class GetAllOfficesService {
  constructor(
    @Inject(OFFICES_REPOSITORY)
    private readonly repository: IOfficesRepository,
  ) {}

  async exec(dtoIn: GetAllOfficesDtoIn): Promise<GetAllOfficesDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllOfficesDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on get all offices';

      throw new Error(message);
    }
  }
}