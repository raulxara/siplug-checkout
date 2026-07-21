import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { GetAllClientsByOfficeIdDtoIn } from './dtos/get-all-clients-by-office-id.dto-in';
import { GetAllClientsByOfficeIdDtoOut } from './dtos/get-all-clients-by-office-id.dto-out';
export declare class GetAllClientsByOfficeIdService {
    private readonly repository;
    constructor(repository: IClientsRepository);
    exec(dtoIn: GetAllClientsByOfficeIdDtoIn): Promise<GetAllClientsByOfficeIdDtoOut>;
}
