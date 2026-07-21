import type { GatewayRow } from '../../../modules/gateways/entities/gateways-repository.interface';

export class UpdateGatewayDtoOut {
  constructor(public readonly gateway: GatewayRow) {}
}