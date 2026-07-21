import type { UserAccessCodeRow } from '../../../entities/user-access-codes-repository.interface';

export class GetAllUserAccessCodesByUserCustomerIdDtoOut {
  constructor(
    public readonly items: UserAccessCodeRow[],
    public readonly total: number,
  ) {}
}