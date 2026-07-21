import type { GatewayRow } from '../../../entities/gateways-repository.interface';

export class GetAllGatewaysDtoOut {
  constructor(
    public readonly items: GatewayRow[],
    public readonly total: number,
  ) {}
}