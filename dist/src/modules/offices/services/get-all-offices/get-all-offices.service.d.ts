import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { GetAllOfficesDtoIn } from './dtos/get-all-offices.dto-in';
import { GetAllOfficesDtoOut } from './dtos/get-all-offices.dto-out';
export declare class GetAllOfficesService {
    private readonly repository;
    constructor(repository: IOfficesRepository);
    exec(dtoIn: GetAllOfficesDtoIn): Promise<GetAllOfficesDtoOut>;
}
