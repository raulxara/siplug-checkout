import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IApiCredentialsRepository } from './api-credentials-repository.interface';

export class ApiCredentialEntity extends AbstractEntity {
  public officeId: string | null = null;
  public clientId: string | null = null;
  public gatewayId: string | null = null;

  public name!: string;
  public slug!: string;
  public provider!: string;
  public providerType!: string;
  public environment!: string;

  public token: string | null = null;
  public origin: string | null = null;
  public config: Record<string, unknown> | null = null;
  public expiresAt: string | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IApiCredentialsRepository) {
    super();
  }

  async create(): Promise<ApiCredentialEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      officeId: fresh.officeId,
      clientId: fresh.clientId,
      gatewayId: fresh.gatewayId,
      name: fresh.name,
      slug: fresh.slug,
      provider: fresh.provider,
      providerType: fresh.providerType,
      environment: fresh.environment,
      token: fresh.token,
      origin: fresh.origin,
      config: fresh.config,
      expiresAt: fresh.expiresAt,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}