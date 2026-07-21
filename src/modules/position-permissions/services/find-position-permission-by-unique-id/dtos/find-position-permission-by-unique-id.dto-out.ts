import type { PositionPermissionRow } from '../../../entities/position-permissions-repository.interface';

export class FindPositionPermissionByUniqueIdDtoOut {
  constructor(public readonly positionPermission: PositionPermissionRow) {}
}