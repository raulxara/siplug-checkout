import type { UserPositionEntity } from '../../../entities/user-position.entity';

export class CreateUserPositionDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly userCustomerId: string,
    public readonly positionId: string,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: UserPositionEntity): CreateUserPositionDtoOut {
    return new CreateUserPositionDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.userCustomerId,
      entity.positionId,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}