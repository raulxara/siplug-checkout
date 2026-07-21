import type { UserAccessCodeEntity } from '../../../entities/user-access-code.entity';

export class CreateUserAccessCodeDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly userCustomerId: string,
    public readonly channel: string,
    public readonly destination: string,
    public readonly code: string,
    public readonly expiresAt: string | null,
    public readonly usedAt: string | null,
    public readonly sentAt: string | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: UserAccessCodeEntity): CreateUserAccessCodeDtoOut {
    return new CreateUserAccessCodeDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.userCustomerId,
      entity.channel,
      entity.destination,
      entity.code,
      entity.expiresAt,
      entity.usedAt,
      entity.sentAt,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'created',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}