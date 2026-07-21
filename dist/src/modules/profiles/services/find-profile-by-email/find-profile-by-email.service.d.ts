import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { FindProfileByEmailDtoIn } from './dtos/find-profile-by-email.dto-in';
import { FindProfileByEmailDtoOut } from './dtos/find-profile-by-email.dto-out';
export declare class FindProfileByEmailService {
    private readonly repository;
    constructor(repository: IProfilesRepository);
    exec(dtoIn: FindProfileByEmailDtoIn): Promise<FindProfileByEmailDtoOut>;
}
