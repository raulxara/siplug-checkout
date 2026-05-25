import type { UserAccessCodeRow } from '../../../entities/user-access-codes-repository.interface';
export declare class FindUserAccessCodeByCodeDtoOut {
    readonly userAccessCode: UserAccessCodeRow;
    constructor(userAccessCode: UserAccessCodeRow);
}
