export class ListPermissionPositionByPositionIdDtoIn {
  public readonly positionId: string;
  public readonly officeId?: string;

  constructor(params: { positionId?: unknown; officeId?: unknown }) {
    this.positionId = String(params.positionId ?? '').trim();

    if (this.positionId === '') {
      throw new Error('positionId is required');
    }

    const officeId = this.normalizeOptionalString(params.officeId);

    if (officeId !== undefined) {
      this.officeId = officeId;
    }
  }

  private normalizeOptionalString(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const normalized = String(value).trim();

    if (normalized === '') {
      return undefined;
    }

    return normalized;
  }
}
