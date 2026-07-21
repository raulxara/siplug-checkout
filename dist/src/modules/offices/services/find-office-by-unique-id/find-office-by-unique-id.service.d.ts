import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { FindOfficeByUniqueIdDtoIn } from './dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdDtoOut } from './dtos/find-office-by-unique-id.dto-out';
export declare class FindOfficeByUniqueIdService {
    private readonly repository;
    constructor(repository: IOfficesRepository);
    exec(dtoIn: FindOfficeByUniqueIdDtoIn): Promise<FindOfficeByUniqueIdDtoOut>;
}
