import { HashPasswordService } from '../../../../common/services/security/hash-password.service';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { CreateClientDtoIn } from './dtos/create-client.dto-in';
import { CreateClientDtoOut } from './dtos/create-client.dto-out';
export declare class CreateClientService {
    private readonly repository;
    private readonly hashPasswordService;
    constructor(repository: IClientsRepository, hashPasswordService: HashPasswordService);
    exec(dtoIn: CreateClientDtoIn): Promise<CreateClientDtoOut>;
}
