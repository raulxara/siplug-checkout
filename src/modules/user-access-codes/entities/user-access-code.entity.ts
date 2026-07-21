import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IUserAccessCodesRepository } from './user-access-codes-repository.interface';

export class UserAccessCodeEntity extends AbstractEntity {
  public userCustomerId!: string;
  public channel!: string;
  public destination!: string;
  public code!: string;
  public expiresAt: string | null = null;
  public usedAt: string | null = null;
  public sentAt: string | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IUserAccessCodesRepository) {
    super();
  }

  async create(): Promise<UserAccessCodeEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      userCustomerId: fresh.userCustomerId,
      channel: fresh.channel,
      destination: fresh.destination,
      code: fresh.code,
      expiresAt: fresh.expiresAt,
      usedAt: fresh.usedAt,
      sentAt: fresh.sentAt,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}