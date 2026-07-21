import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { ValidateGatewaySlugUniquenessDtoIn } from './dtos/validate-gateway-slug-uniqueness.dto-in';
export declare class ValidateGatewaySlugUniquenessService {
    private readonly repository;
    constructor(repository: IGatewaysRepository);
    exec(dtoIn: ValidateGatewaySlugUniquenessDtoIn): Promise<void>;
}
