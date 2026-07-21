import type { PositionPermissionRow } from '../../../entities/position-permissions-repository.interface';

export class GetAllPositionPermissionsByPositionIdsDtoOut {
  constructor(
    public readonly items: PositionPermissionRow[],
    public readonly total: number,
  ) {}
}