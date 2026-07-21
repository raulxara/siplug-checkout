import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { CreateUserAccessCodeDtoIn } from './dtos/create-user-access-code.dto-in';
import { CreateUserAccessCodeDtoOut } from './dtos/create-user-access-code.dto-out';
export declare class CreateUserAccessCodeService {
    private readonly repository;
    constructor(repository: IUserAccessCodesRepository);
    exec(dtoIn: CreateUserAccessCodeDtoIn): Promise<CreateUserAccessCodeDtoOut>;
}
