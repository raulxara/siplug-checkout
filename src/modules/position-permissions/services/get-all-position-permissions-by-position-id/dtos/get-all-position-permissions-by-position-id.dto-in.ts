export class GetAllPositionPermissionsByPositionIdDtoIn {
  public readonly positionId: string;

  constructor(positionId: string) {
    this.positionId = positionId;

    if (this.positionId.trim() === '') {
      throw new Error('positionId is required');
    }
  }
}