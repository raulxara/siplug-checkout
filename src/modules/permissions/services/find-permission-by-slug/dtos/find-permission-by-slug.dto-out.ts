import type { PermissionRow } from '../../../entities/permissions-repository.interface';

export class FindPermissionBySlugDtoOut {
  constructor(public readonly permission: PermissionRow) {}
}