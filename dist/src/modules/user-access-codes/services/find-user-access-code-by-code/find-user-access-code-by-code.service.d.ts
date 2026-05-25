import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { FindUserAccessCodeByCodeDtoIn } from './dtos/find-user-access-code-by-code.dto-in';
import { FindUserAccessCodeByCodeDtoOut } from './dtos/find-user-access-code-by-code.dto-out';
export declare class FindUserAccessCodeByCodeService {
    private readonly repository;
    constructor(repository: IUserAccessCodesRepository);
    exec(dtoIn: FindUserAccessCodeByCodeDtoIn): Promise<FindUserAccessCodeByCodeDtoOut>;
}
