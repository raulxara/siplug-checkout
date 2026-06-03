import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { FindUserAccessCodeByUniqueIdDtoIn } from './dtos/find-user-access-code-by-unique-id.dto-in';
import { FindUserAccessCodeByUniqueIdDtoOut } from './dtos/find-user-access-code-by-unique-id.dto-out';
export declare class FindUserAccessCodeByUniqueIdService {
    private readonly repository;
    constructor(repository: IUserAccessCodesRepository);
    exec(dtoIn: FindUserAccessCodeByUniqueIdDtoIn): Promise<FindUserAccessCodeByUniqueIdDtoOut>;
}
