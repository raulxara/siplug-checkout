import type { PermissionRow } from '../../../entities/permissions-repository.interface';

export class GetAllPermissionsByUniqueIdsDtoOut {
  constructor(
    public readonly items: PermissionRow[],
    public readonly total: number,
  ) {}
}