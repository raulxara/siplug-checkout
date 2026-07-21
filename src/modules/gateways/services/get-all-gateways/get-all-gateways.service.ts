import { Inject, Injectable } from '@nestjs/common';
import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { GATEWAYS_REPOSITORY } from '../../tokens/gateways.tokens';
import { GetAllGatewaysDtoIn } from './dtos/get-all-gateways.dto-in';
import { GetAllGatewaysDtoOut } from './dtos/get-all-gateways.dto-out';

@Injectable()
export class GetAllGatewaysService {
  constructor(
    @Inject(GATEWAYS_REPOSITORY)
    private readonly repository: IGatewaysRepository,
  ) {}

  async exec(dtoIn: GetAllGatewaysDtoIn): Promise<GetAllGatewaysDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllGatewaysDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on get all gateways';

      throw new Error(message);
    }
  }
}