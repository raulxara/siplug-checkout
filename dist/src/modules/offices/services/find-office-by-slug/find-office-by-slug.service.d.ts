import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { FindOfficeBySlugDtoIn } from './dtos/find-office-by-slug.dto-in';
import { FindOfficeBySlugDtoOut } from './dtos/find-office-by-slug.dto-out';
export declare class FindOfficeBySlugService {
    private readonly repository;
    constructor(repository: IOfficesRepository);
    exec(dtoIn: FindOfficeBySlugDtoIn): Promise<FindOfficeBySlugDtoOut>;
}
