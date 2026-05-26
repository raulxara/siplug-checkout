import { Inject, Injectable } from '@nestjs/common';
import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { GATEWAYS_REPOSITORY } from '../../tokens/gateways.tokens';
import { ValidateGatewaySlugUniquenessDtoIn } from './dtos/validate-gateway-slug-uniqueness.dto-in';

@Injectable()
export class ValidateGatewaySlugUniquenessService {
  constructor(
    @Inject(GATEWAYS_REPOSITORY)
    private readonly repository: IGatewaysRepository,
  ) {}

  async exec(dtoIn: ValidateGatewaySlugUniquenessDtoIn): Promise<void> {
    try {
      const gateway = await this.repository.findBySlug(dtoIn.slug);

      if (gateway) {
        throw new Error('gateway slug already exists');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on validate gateway slug uniqueness';

      throw new Error(message);
    }
  }
}