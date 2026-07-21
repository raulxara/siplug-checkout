export class FindPositionPermissionByPositionAndPermissionDtoIn {
  public readonly positionId: string;
  public readonly permissionId: string;

  constructor(params: { positionId: string; permissionId: string }) {
    this.positionId = params.positionId;
    this.permissionId = params.permissionId;

    if (this.positionId.trim() === '') {
      throw new Error('positionId is required');
    }

    if (this.permissionId.trim() === '') {
      throw new Error('permissionId is required');
    }
  }
}