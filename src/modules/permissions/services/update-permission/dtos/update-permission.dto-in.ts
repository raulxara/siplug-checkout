export class UpdatePermissionDtoIn {
  public readonly _id: string;
  public readonly officeId: string | null;
  public readonly name: string | null;
  public readonly slug: string | null;
  public readonly description: string | null;
  public readonly entity: string | null;
  public readonly action: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    officeId?: string | null;
    name?: string | null;
    slug?: string | null;
    description?: string | null;
    entity?: string | null;
    action?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.officeId = params.officeId ?? null;
    this.name = params.name ?? null;
    this.slug = params.slug ?? null;
    this.description = params.description ?? null;
    this.entity = params.entity ?? null;
    this.action = params.action ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'system';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}