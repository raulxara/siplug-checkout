import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { FindProfileByDocumentDtoIn } from './dtos/find-profile-by-document.dto-in';
import { FindProfileByDocumentDtoOut } from './dtos/find-profile-by-document.dto-out';
export declare class FindProfileByDocumentService {
    private readonly repository;
    constructor(repository: IProfilesRepository);
    exec(dtoIn: FindProfileByDocumentDtoIn): Promise<FindProfileByDocumentDtoOut>;
}
