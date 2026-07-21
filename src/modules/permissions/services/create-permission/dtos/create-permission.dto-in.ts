export class CreatePermissionDtoIn {
  public readonly officeId: string | null;
  public readonly name: string;
  public readonly slug: string;
  public readonly description: string | null;
  public readonly entity: string;
  public readonly action: string;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    officeId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    entity: string;
    action: string;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.officeId = params.officeId ?? null;
    this.name = params.name;
    this.slug = params.slug;
    this.description = params.description ?? null;
    this.entity = params.entity;
    this.action = params.action;
    this.config = params.config ?? null;
    this.status = params.status ?? 'active';

    if (this.name.trim() === '') {
      throw new Error('name is required');
    }

    if (this.slug.trim() === '') {
      throw new Error('slug is required');
    }

    if (this.entity.trim() === '') {
      throw new Error('entity is required');
    }

    if (this.action.trim() === '') {
      throw new Error('action is required');
    }
  }
}