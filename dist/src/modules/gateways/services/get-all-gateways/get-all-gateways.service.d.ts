import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { GetAllGatewaysDtoIn } from './dtos/get-all-gateways.dto-in';
import { GetAllGatewaysDtoOut } from './dtos/get-all-gateways.dto-out';
export declare class GetAllGatewaysService {
    private readonly repository;
    constructor(repository: IGatewaysRepository);
    exec(dtoIn: GetAllGatewaysDtoIn): Promise<GetAllGatewaysDtoOut>;
}
