import type { GatewayRow } from '../../../modules/gateways/entities/gateways-repository.interface';
export declare class UpdateGatewayDtoOut {
    readonly gateway: GatewayRow;
    constructor(gateway: GatewayRow);
}
