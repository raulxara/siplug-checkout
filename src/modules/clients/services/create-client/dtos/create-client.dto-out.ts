import type { ClientEntity } from '../../../entities/client.entity';

export class CreateClientDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly officeId: string | null,
    public readonly customerId: string | null,
    public readonly userType: string,
    public readonly username: string,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: ClientEntity): CreateClientDtoOut {
    return new CreateClientDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.officeId,
      entity.customerId,
      entity.userType,
      entity.username,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}