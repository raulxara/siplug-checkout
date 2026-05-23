import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IUserCustomersRepository } from './user-customers-repository.interface';

export class UserCustomerEntity extends AbstractEntity {
  public clientId!: string;
  public profileId!: string;
  public token!: string;
  public twoFaRequired = false;
  public twoFaActive = false;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IUserCustomersRepository) {
    super();
  }

  async create(): Promise<UserCustomerEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      clientId: fresh.clientId,
      profileId: fresh.profileId,
      token: fresh.token,
      twoFaRequired: fresh.twoFaRequired,
      twoFaActive: fresh.twoFaActive,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}