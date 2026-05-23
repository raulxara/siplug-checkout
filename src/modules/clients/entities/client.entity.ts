import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IClientsRepository } from './clients-repository.interface';

export class ClientEntity extends AbstractEntity {
  public officeId: string | null = null;
  public customerId: string | null = null;
  public userType!: string;
  public username!: string;
  public password!: string;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IClientsRepository) {
    super();
  }

  async create(): Promise<ClientEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      officeId: fresh.officeId,
      customerId: fresh.customerId,
      userType: fresh.userType,
      username: fresh.username,
      password: fresh.password,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}