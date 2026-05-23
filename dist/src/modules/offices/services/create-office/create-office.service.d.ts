import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { CreateOfficeDtoIn } from './dtos/create-office.dto-in';
import { CreateOfficeDtoOut } from './dtos/create-office.dto-out';
export declare class CreateOfficeService {
    private readonly repository;
    constructor(repository: IOfficesRepository);
    exec(dtoIn: CreateOfficeDtoIn): Promise<CreateOfficeDtoOut>;
}
