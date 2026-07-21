import type { PermissionRow } from '../../../entities/permissions-repository.interface';

export class ListPermissionsByOfficeIdDtoOut {
  constructor(public readonly permissions: PermissionRow[]) {}
}
