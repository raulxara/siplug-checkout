export class UpdatePositionByUniqueIdDtoIn {
  public readonly positionId: string;
  public readonly data: Record<string, unknown>;

  constructor(params: { positionId?: unknown; _id?: unknown; data?: unknown }) {
    this.positionId = String(params.positionId ?? params._id ?? '').trim();

    if (this.positionId === '') {
      throw new Error('positionId is required');
    }

    if (!params.data || typeof params.data !== 'object' || Array.isArray(params.data)) {
      throw new Error('data is required');
    }

    this.data = params.data as Record<string, unknown>;
  }
}
