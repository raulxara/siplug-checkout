import type { GatewayEntity } from '../../../entities/gateway.entity';

export class CreateGatewayDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly provider: string,
    public readonly description: string | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: GatewayEntity): CreateGatewayDtoOut {
    return new CreateGatewayDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.name,
      entity.slug,
      entity.provider,
      entity.description,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}