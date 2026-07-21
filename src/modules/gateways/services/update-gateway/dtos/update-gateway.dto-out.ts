import type { GatewayRow } from '../../../entities/gateways-repository.interface';

export class UpdateGatewayDtoOut {
  constructor(public readonly gateway: GatewayRow) {}
}