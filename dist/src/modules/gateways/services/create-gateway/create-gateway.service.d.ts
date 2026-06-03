import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { CreateGatewayDtoIn } from './dtos/create-gateway.dto-in';
import { CreateGatewayDtoOut } from './dtos/create-gateway.dto-out';
export declare class CreateGatewayService {
    private readonly repository;
    constructor(repository: IGatewaysRepository);
    exec(dtoIn: CreateGatewayDtoIn): Promise<CreateGatewayDtoOut>;
}
