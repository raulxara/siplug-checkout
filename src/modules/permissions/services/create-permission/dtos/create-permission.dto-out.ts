import type { PermissionEntity } from '../../../entities/permission.entity';

export class CreatePermissionDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly officeId: string | null,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly entity: string,
    public readonly action: string,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: PermissionEntity): CreatePermissionDtoOut {
    return new CreatePermissionDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.officeId,
      entity.name,
      entity.slug,
      entity.description,
      entity.entity,
      entity.action,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}