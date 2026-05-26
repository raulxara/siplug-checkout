import { Inject, Injectable } from '@nestjs/common';
import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { GATEWAYS_REPOSITORY } from '../../tokens/gateways.tokens';
import { FindGatewayByUniqueIdDtoIn } from './dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdDtoOut } from './dtos/find-gateway-by-unique-id.dto-out';

@Injectable()
export class FindGatewayByUniqueIdService {
  constructor(
    @Inject(GATEWAYS_REPOSITORY)
    private readonly repository: IGatewaysRepository,
  ) {}

  async exec(
    dtoIn: FindGatewayByUniqueIdDtoIn,
  ): Promise<FindGatewayByUniqueIdDtoOut> {
    try {
      const gateway = await this.repository.findByUniqueId(dtoIn._id);

      if (!gateway) {
        throw new Error('gateway not found');
      }

      return new FindGatewayByUniqueIdDtoOut(gateway);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find gateway by unique id';

      throw new Error(message);
    }
  }
}