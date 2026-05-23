import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { FindProfileByUniqueIdDtoIn } from './dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdDtoOut } from './dtos/find-profile-by-unique-id.dto-out';
export declare class FindProfileByUniqueIdService {
    private readonly repository;
    constructor(repository: IProfilesRepository);
    exec(dtoIn: FindProfileByUniqueIdDtoIn): Promise<FindProfileByUniqueIdDtoOut>;
}
