import { Inject, Injectable } from '@nestjs/common';
import { ApiCredentialEntity } from '../../entities/api-credential.entity';
import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { API_CREDENTIALS_REPOSITORY } from '../../tokens/api-credentials.tokens';
import { CreateApiCredentialDtoIn } from './dtos/create-api-credential.dto-in';
import { CreateApiCredentialDtoOut } from './dtos/create-api-credential.dto-out';

@Injectable()
export class CreateApiCredentialService {
  constructor(
    @Inject(API_CREDENTIALS_REPOSITORY)
    private readonly repository: IApiCredentialsRepository,
  ) {}

  async exec(
    dtoIn: CreateApiCredentialDtoIn,
  ): Promise<CreateApiCredentialDtoOut> {
    try {
      const entity = new ApiCredentialEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.clientId = dtoIn.clientId;
      entity.gatewayId = dtoIn.gatewayId;
      entity.name = dtoIn.name;
      entity.slug = dtoIn.slug;
      entity.provider = dtoIn.provider;
      entity.providerType = dtoIn.providerType;
      entity.environment = dtoIn.environment;
      entity.token = dtoIn.token;
      entity.origin = dtoIn.origin;
      entity.config = dtoIn.config;
      entity.expiresAt = dtoIn.expiresAt;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateApiCredentialDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create api credential';

      throw new Error(message);
    }
  }
}