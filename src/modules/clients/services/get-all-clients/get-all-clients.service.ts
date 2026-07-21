import { Inject, Injectable } from '@nestjs/common';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { CLIENTS_REPOSITORY } from '../../tokens/clients.tokens';
import { GetAllClientsDtoIn } from './dtos/get-all-clients.dto-in';
import { GetAllClientsDtoOut } from './dtos/get-all-clients.dto-out';

@Injectable()
export class GetAllClientsService {
  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly repository: IClientsRepository,
  ) {}

  async exec(dtoIn: GetAllClientsDtoIn): Promise<GetAllClientsDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllClientsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on get all clients';

      throw new Error(message);
    }
  }
}