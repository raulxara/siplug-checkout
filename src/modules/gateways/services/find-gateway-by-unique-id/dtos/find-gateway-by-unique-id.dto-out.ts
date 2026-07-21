import type { GatewayRow } from '../../../entities/gateways-repository.interface';

export class FindGatewayByUniqueIdDtoOut {
  constructor(public readonly gateway: GatewayRow) {}
}