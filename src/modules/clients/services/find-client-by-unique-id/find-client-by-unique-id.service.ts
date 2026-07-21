import { Inject, Injectable } from '@nestjs/common';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { CLIENTS_REPOSITORY } from '../../tokens/clients.tokens';
import { FindClientByUniqueIdDtoIn } from './dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdDtoOut } from './dtos/find-client-by-unique-id.dto-out';

@Injectable()
export class FindClientByUniqueIdService {
  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly repository: IClientsRepository,
  ) {}

  async exec(
    dtoIn: FindClientByUniqueIdDtoIn,
  ): Promise<FindClientByUniqueIdDtoOut> {
    try {
      const client = await this.repository.findByUniqueId(dtoIn._id);

      if (!client) {
        throw new Error('client not found');
      }

      return new FindClientByUniqueIdDtoOut(client);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find client';

      throw new Error(message);
    }
  }
}