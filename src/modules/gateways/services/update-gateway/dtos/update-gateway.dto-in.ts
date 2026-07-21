export class UpdateGatewayDtoIn {
  public readonly _id: string;
  public readonly name: string | null;
  public readonly slug: string | null;
  public readonly provider: string | null;
  public readonly description: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    name?: string | null;
    slug?: string | null;
    provider?: string | null;
    description?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.name = params.name ?? null;
    this.slug = params.slug ?? null;
    this.provider = params.provider ?? null;
    this.description = params.description ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdateGatewayService';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}