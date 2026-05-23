import type { PermissionRow } from '../../../entities/permissions-repository.interface';

export class FindPermissionByUniqueIdDtoOut {
  constructor(public readonly permission: PermissionRow) {}
}