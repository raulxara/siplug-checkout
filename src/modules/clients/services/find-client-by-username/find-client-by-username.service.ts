import { Inject, Injectable } from '@nestjs/common';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { CLIENTS_REPOSITORY } from '../../tokens/clients.tokens';
import { FindClientByUsernameDtoIn } from './dtos/find-client-by-username.dto-in';
import { FindClientByUsernameDtoOut } from './dtos/find-client-by-username.dto-out';

@Injectable()
export class FindClientByUsernameService {
  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly repository: IClientsRepository,
  ) {}

  async exec(
    dtoIn: FindClientByUsernameDtoIn,
  ): Promise<FindClientByUsernameDtoOut> {
    try {
      const client = await this.repository.findByUsername(dtoIn.username);

      if (!client) {
        throw new Error('client not found');
      }

      return new FindClientByUsernameDtoOut(client);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find client username';

      throw new Error(message);
    }
  }
}