import { Inject, Injectable } from '@nestjs/common';
import { GatewayEntity } from '../../entities/gateway.entity';
import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { GATEWAYS_REPOSITORY } from '../../tokens/gateways.tokens';
import { CreateGatewayDtoIn } from './dtos/create-gateway.dto-in';
import { CreateGatewayDtoOut } from './dtos/create-gateway.dto-out';

@Injectable()
export class CreateGatewayService {
  constructor(
    @Inject(GATEWAYS_REPOSITORY)
    private readonly repository: IGatewaysRepository,
  ) {}

  async exec(dtoIn: CreateGatewayDtoIn): Promise<CreateGatewayDtoOut> {
    try {
      const entity = new GatewayEntity(this.repository);

      entity.name = dtoIn.name;
      entity.slug = dtoIn.slug;
      entity.provider = dtoIn.provider;
      entity.description = dtoIn.description;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateGatewayDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on create gateway';

      throw new Error(message);
    }
  }
}