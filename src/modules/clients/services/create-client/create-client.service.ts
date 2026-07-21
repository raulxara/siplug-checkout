import { Inject, Injectable } from '@nestjs/common';
import { HashPasswordService } from '../../../../common/services/security/hash-password.service';
import { ClientEntity } from '../../entities/client.entity';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { CLIENTS_REPOSITORY } from '../../tokens/clients.tokens';
import { CreateClientDtoIn } from './dtos/create-client.dto-in';
import { CreateClientDtoOut } from './dtos/create-client.dto-out';

@Injectable()
export class CreateClientService {
  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly repository: IClientsRepository,
    private readonly hashPasswordService: HashPasswordService,
  ) {}

  async exec(dtoIn: CreateClientDtoIn): Promise<CreateClientDtoOut> {
    try {
      const hashedPassword = await this.hashPasswordService.exec(
        dtoIn.password,
      );

      const entity = new ClientEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.customerId = dtoIn.customerId;
      entity.userType = dtoIn.userType;
      entity.username = dtoIn.username;
      entity.password = hashedPassword;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateClientDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on create client';

      throw new Error(message);
    }
  }
}