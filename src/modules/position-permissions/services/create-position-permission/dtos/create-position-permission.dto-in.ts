export class CreatePositionPermissionDtoIn {
  public readonly positionId: string;
  public readonly permissionId: string;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    positionId: string;
    permissionId: string;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.positionId = params.positionId;
    this.permissionId = params.permissionId;
    this.config = params.config ?? null;
    this.status = params.status ?? 'active';

    if (this.positionId.trim() === '') {
      throw new Error('positionId is required');
    }

    if (this.permissionId.trim() === '') {
      throw new Error('permissionId is required');
    }
  }
}