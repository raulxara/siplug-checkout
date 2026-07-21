import type { PositionPermissionRow } from '../../../entities/position-permissions-repository.interface';

export class FindPositionPermissionByPositionAndPermissionDtoOut {
  constructor(public readonly positionPermission: PositionPermissionRow) {}
}