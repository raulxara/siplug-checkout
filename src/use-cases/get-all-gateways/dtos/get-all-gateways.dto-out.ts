import type { GatewayRow } from '../../../modules/gateways/entities/gateways-repository.interface';

export class GetAllGatewaysDtoOut {
  constructor(
    public readonly items: GatewayRow[],
    public readonly total: number,
    public readonly page: number,
    public readonly perPage: number,
    public readonly totalPages: number,
  ) {}
}