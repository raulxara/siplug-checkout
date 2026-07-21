import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { FindClientByUsernameDtoIn } from './dtos/find-client-by-username.dto-in';
import { FindClientByUsernameDtoOut } from './dtos/find-client-by-username.dto-out';
export declare class FindClientByUsernameService {
    private readonly repository;
    constructor(repository: IClientsRepository);
    exec(dtoIn: FindClientByUsernameDtoIn): Promise<FindClientByUsernameDtoOut>;
}
