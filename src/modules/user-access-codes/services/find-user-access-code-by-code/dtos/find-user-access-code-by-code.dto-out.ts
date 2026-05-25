import type { UserAccessCodeRow } from '../../../entities/user-access-codes-repository.interface';

export class FindUserAccessCodeByCodeDtoOut {
  constructor(public readonly userAccessCode: UserAccessCodeRow) {}
}