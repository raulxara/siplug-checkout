import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { GetAllClientsDtoIn } from './dtos/get-all-clients.dto-in';
import { GetAllClientsDtoOut } from './dtos/get-all-clients.dto-out';
export declare class GetAllClientsService {
    private readonly repository;
    constructor(repository: IClientsRepository);
    exec(dtoIn: GetAllClientsDtoIn): Promise<GetAllClientsDtoOut>;
}
