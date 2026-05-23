import type { UserCustomerEntity } from '../../../entities/user-customer.entity';

export class CreateUserCustomerDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly clientId: string,
    public readonly profileId: string,
    public readonly token: string,
    public readonly twoFaRequired: boolean,
    public readonly twoFaActive: boolean,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: UserCustomerEntity): CreateUserCustomerDtoOut {
    return new CreateUserCustomerDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.clientId,
      entity.profileId,
      entity.token,
      entity.twoFaRequired,
      entity.twoFaActive,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}