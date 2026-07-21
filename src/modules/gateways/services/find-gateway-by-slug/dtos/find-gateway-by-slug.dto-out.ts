import type { GatewayRow } from '../../../entities/gateways-repository.interface';

export class FindGatewayBySlugDtoOut {
  constructor(public readonly gateway: GatewayRow) {}
}