import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { CreateProfileDtoIn } from './dtos/create-profile.dto-in';
import { CreateProfileDtoOut } from './dtos/create-profile.dto-out';
export declare class CreateProfileService {
    private readonly repository;
    constructor(repository: IProfilesRepository);
    exec(dtoIn: CreateProfileDtoIn): Promise<CreateProfileDtoOut>;
}
