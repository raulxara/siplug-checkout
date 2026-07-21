import type { PermissionRow } from '../../../entities/permissions-repository.interface';

export class UpdatePermissionDtoOut {
  constructor(public readonly permission: PermissionRow) {}
}