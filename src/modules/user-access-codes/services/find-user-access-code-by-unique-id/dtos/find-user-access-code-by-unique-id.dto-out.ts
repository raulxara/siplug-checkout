import type { UserAccessCodeRow } from '../../../entities/user-access-codes-repository.interface';

export class FindUserAccessCodeByUniqueIdDtoOut {
  constructor(public readonly userAccessCode: UserAccessCodeRow) {}
}