import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { FindGatewayBySlugDtoIn } from './dtos/find-gateway-by-slug.dto-in';
import { FindGatewayBySlugDtoOut } from './dtos/find-gateway-by-slug.dto-out';
export declare class FindGatewayBySlugService {
    private readonly repository;
    constructor(repository: IGatewaysRepository);
    exec(dtoIn: FindGatewayBySlugDtoIn): Promise<FindGatewayBySlugDtoOut>;
}
