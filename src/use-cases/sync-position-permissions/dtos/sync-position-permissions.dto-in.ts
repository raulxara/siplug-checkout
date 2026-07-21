export class SyncPositionPermissionsDtoIn {
  public readonly token: string;
  public readonly positionId: string;
  public readonly permissionIds: string[];
  public readonly source: string;

  constructor(params: {
    token?: string;
    positionId?: string;
    permissionIds?: string[];
    source?: string;
  }) {
    this.token = params.token ?? '';
    this.positionId = params.positionId ?? '';
    this.permissionIds = params.permissionIds ?? [];
    this.source = params.source ?? 'SyncPositionPermissionsUseCase';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.positionId.trim() === '') {
      throw new Error('positionId is required');
    }

    if (!Array.isArray(this.permissionIds) || this.permissionIds.length === 0) {
      throw new Error('permissionIds is required');
    }

    for (const permissionId of this.permissionIds) {
      if (permissionId.trim() === '') {
        throw new Error('permissionIds contains invalid value');
      }
    }

    const uniquePermissionIds = new Set(this.permissionIds);

    if (uniquePermissionIds.size !== this.permissionIds.length) {
      throw new Error('permissionIds contains duplicated values');
    }
  }
}