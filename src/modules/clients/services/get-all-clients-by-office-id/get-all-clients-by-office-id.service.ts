import { Inject, Injectable } from '@nestjs/common';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { CLIENTS_REPOSITORY } from '../../tokens/clients.tokens';
import { GetAllClientsByOfficeIdDtoIn } from './dtos/get-all-clients-by-office-id.dto-in';
import { GetAllClientsByOfficeIdDtoOut } from './dtos/get-all-clients-by-office-id.dto-out';

@Injectable()
export class GetAllClientsByOfficeIdService {
  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly repository: IClientsRepository,
  ) {}

  async exec(
    dtoIn: GetAllClientsByOfficeIdDtoIn,
  ): Promise<GetAllClientsByOfficeIdDtoOut> {
    try {
      const rows = await this.repository.getAllByOfficeId(dtoIn.officeId);

      return new GetAllClientsByOfficeIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all clients by office id';

      throw new Error(message);
    }
  }
}