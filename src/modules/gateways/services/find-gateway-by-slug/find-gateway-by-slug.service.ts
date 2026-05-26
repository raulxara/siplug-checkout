import { Inject, Injectable } from '@nestjs/common';
import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { GATEWAYS_REPOSITORY } from '../../tokens/gateways.tokens';
import { FindGatewayBySlugDtoIn } from './dtos/find-gateway-by-slug.dto-in';
import { FindGatewayBySlugDtoOut } from './dtos/find-gateway-by-slug.dto-out';

@Injectable()
export class FindGatewayBySlugService {
  constructor(
    @Inject(GATEWAYS_REPOSITORY)
    private readonly repository: IGatewaysRepository,
  ) {}

  async exec(dtoIn: FindGatewayBySlugDtoIn): Promise<FindGatewayBySlugDtoOut> {
    try {
      const gateway = await this.repository.findBySlug(dtoIn.slug);

      if (!gateway) {
        throw new Error('gateway not found');
      }

      return new FindGatewayBySlugDtoOut(gateway);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find gateway by slug';

      throw new Error(message);
    }
  }
}