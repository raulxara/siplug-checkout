import type { UserAccessCodeRow } from '../../../entities/user-access-codes-repository.interface';

export class UpdateUserAccessCodeDtoOut {
  constructor(public readonly userAccessCode: UserAccessCodeRow) {}
}