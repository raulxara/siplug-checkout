import type { PositionPermissionRow } from '../../../entities/position-permissions-repository.interface';

export class UpdatePositionPermissionDtoOut {
  constructor(public readonly positionPermission: PositionPermissionRow) {}
}