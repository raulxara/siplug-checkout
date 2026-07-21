import type { PositionPermissionRow } from '../../../entities/position-permissions-repository.interface';

export class GetAllPositionPermissionsDtoOut {
  constructor(
    public readonly items: PositionPermissionRow[],
    public readonly total: number,
  ) {}
}