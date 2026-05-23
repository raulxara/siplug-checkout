import type { PermissionRow } from '../../../entities/permissions-repository.interface';

export class GetAllPermissionsDtoOut {
  constructor(
    public readonly items: PermissionRow[],
    public readonly total: number,
  ) {}
}