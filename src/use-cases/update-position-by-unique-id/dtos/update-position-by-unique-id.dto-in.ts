export class UpdatePositionByUniqueIdDtoIn {
  public readonly positionId: string;
  public readonly officeId?: string;

  public readonly name?: string;
  public readonly slug?: string;
  public readonly description?: string;
  public readonly config?: Record<string, unknown>;
  public readonly status?: string;

  constructor(params: {
    positionId?: unknown;
    _id?: unknown;
    officeId?: unknown;
    name?: unknown;
    slug?: unknown;
    description?: unknown;
    config?: unknown;
    status?: unknown;
  }) {
    this.positionId = String(params.positionId ?? params._id ?? '').trim();

    if (this.positionId === '') {
      throw new Error('positionId is required');
    }

    const officeId = this.normalizeOptionalString(params.officeId);

    if (officeId !== undefined) {
      this.officeId = officeId;
    }

    const name = this.normalizeOptionalString(params.name);

    if (name !== undefined) {
      this.name = name;
    }

    const slug = this.normalizeOptionalString(params.slug);

    if (slug !== undefined) {
      this.slug = slug;
    }

    const description = this.normalizeOptionalString(params.description);

    if (description !== undefined) {
      this.description = description;
    }

    if (
      params.config !== undefined &&
      params.config !== null &&
      typeof params.config === 'object' &&
      !Array.isArray(params.config)
    ) {
      this.config = params.config as Record<string, unknown>;
    }

    const status = this.normalizeOptionalString(params.status);

    if (status !== undefined) {
      const normalizedStatus = status.toLowerCase();

      if (!['active', 'inactive'].includes(normalizedStatus)) {
        throw new Error('status must be active or inactive');
      }

      this.status = normalizedStatus;
    }

    if (
      this.name === undefined &&
      this.slug === undefined &&
      this.description === undefined &&
      this.config === undefined &&
      this.status === undefined
    ) {
      throw new Error('at least one field is required to update position');
    }
  }

  private normalizeOptionalString(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const normalized = String(value).trim();

    if (normalized === '') {
      throw new Error('empty string is not allowed');
    }

    return normalized;
  }
}
