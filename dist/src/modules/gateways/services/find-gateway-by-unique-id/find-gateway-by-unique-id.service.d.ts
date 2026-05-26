import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { FindGatewayByUniqueIdDtoIn } from './dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdDtoOut } from './dtos/find-gateway-by-unique-id.dto-out';
export declare class FindGatewayByUniqueIdService {
    private readonly repository;
    constructor(repository: IGatewaysRepository);
    exec(dtoIn: FindGatewayByUniqueIdDtoIn): Promise<FindGatewayByUniqueIdDtoOut>;
}
