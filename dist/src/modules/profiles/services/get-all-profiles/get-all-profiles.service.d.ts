import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { GetAllProfilesDtoIn } from './dtos/get-all-profiles.dto-in';
import { GetAllProfilesDtoOut } from './dtos/get-all-profiles.dto-out';
export declare class GetAllProfilesService {
    private readonly repository;
    constructor(repository: IProfilesRepository);
    exec(dtoIn: GetAllProfilesDtoIn): Promise<GetAllProfilesDtoOut>;
}
