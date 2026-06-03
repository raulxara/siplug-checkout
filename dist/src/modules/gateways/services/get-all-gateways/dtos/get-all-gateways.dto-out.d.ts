import type { GatewayRow } from '../../../entities/gateways-repository.interface';
export declare class GetAllGatewaysDtoOut {
    readonly items: GatewayRow[];
    readonly total: number;
    constructor(items: GatewayRow[], total: number);
}
