export class GetPositionByUniqueIdDtoIn {
  public readonly positionId: string;

  constructor(params: { positionId?: unknown; _id?: unknown }) {
    this.positionId = String(params.positionId ?? params._id ?? '').trim();

    if (this.positionId === '') {
      throw new Error('positionId is required');
    }
  }
}