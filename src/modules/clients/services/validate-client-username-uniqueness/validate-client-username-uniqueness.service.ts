import { Inject, Injectable } from '@nestjs/common';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { CLIENTS_REPOSITORY } from '../../tokens/clients.tokens';
import { ValidateClientUsernameUniquenessDtoIn } from './dtos/validate-client-username-uniqueness.dto-in';

@Injectable()
export class ValidateClientUsernameUniquenessService {
  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly repository: IClientsRepository,
  ) {}

  async exec(dtoIn: ValidateClientUsernameUniquenessDtoIn): Promise<void> {
    try {
      const client = await this.repository.findByUsername(dtoIn.username);

      if (client) {
        throw new Error('client username already exists');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on validate client username uniqueness';

      throw new Error(message);
    }
  }
}