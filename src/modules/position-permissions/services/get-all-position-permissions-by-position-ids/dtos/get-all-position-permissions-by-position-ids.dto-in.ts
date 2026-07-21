export class GetAllPositionPermissionsByPositionIdsDtoIn {
  public readonly positionIds: string[];

  constructor(positionIds: string[]) {
    this.positionIds = positionIds;

    if (!Array.isArray(this.positionIds) || this.positionIds.length === 0) {
      throw new Error('positionIds is required');
    }

    for (const positionId of this.positionIds) {
      if (positionId.trim() === '') {
        throw new Error('positionIds contains invalid value');
      }
    }
  }
}