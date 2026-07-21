import type { PositionPermissionEntity } from './position-permission.entity';

export type PositionPermissionRow = {
  id: number;
  _id: string;
  positionId: string;
  permissionId: string;
  config: Record<string, unknown> | null;
  changesHistory: Array<Record<string, unknown>> | null;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export interface IPositionPermissionsRepository {
  create(entity: PositionPermissionEntity): Promise<PositionPermissionEntity>;

  updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<PositionPermissionRow>;

  findByUniqueId(_id: string): Promise<PositionPermissionRow | null>;

  findByPositionAndPermission(
    positionId: string,
    permissionId: string,
  ): Promise<PositionPermissionRow | null>;

  getAll(): Promise<PositionPermissionRow[]>;

  getAllByPositionId(positionId: string): Promise<PositionPermissionRow[]>;

  getAllByPositionIds(positionIds: string[]): Promise<PositionPermissionRow[]>;
}