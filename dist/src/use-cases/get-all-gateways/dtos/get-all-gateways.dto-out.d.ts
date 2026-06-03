import type { GatewayRow } from '../../../modules/gateways/entities/gateways-repository.interface';
export declare class GetAllGatewaysDtoOut {
    readonly items: GatewayRow[];
    readonly total: number;
    readonly page: number;
    readonly perPage: number;
    readonly totalPages: number;
    constructor(items: GatewayRow[], total: number, page: number, perPage: number, totalPages: number);
}
