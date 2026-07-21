import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { FindClientByUniqueIdDtoIn } from './dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdDtoOut } from './dtos/find-client-by-unique-id.dto-out';
export declare class FindClientByUniqueIdService {
    private readonly repository;
    constructor(repository: IClientsRepository);
    exec(dtoIn: FindClientByUniqueIdDtoIn): Promise<FindClientByUniqueIdDtoOut>;
}
