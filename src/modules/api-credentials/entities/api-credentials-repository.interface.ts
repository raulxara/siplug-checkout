import type { ApiCredentialEntity } from './api-credential.entity';

export type ApiCredentialRow = {
  id: number;
  _id: string;
  officeId: string | null;
  clientId: string | null;
  gatewayId: string | null;
  name: string;
  slug: string;
  provider: string;
  providerType: string;
  environment: string;
  token: string | null;
  origin: string | null;
  config: Record<string, unknown> | null;
  expiresAt: string | null;
  changesHistory: Array<Record<string, unknown>> | null;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export interface IApiCredentialsRepository {
  create(entity: ApiCredentialEntity): Promise<ApiCredentialEntity>;

  updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<ApiCredentialRow>;

  findByUniqueId(_id: string): Promise<ApiCredentialRow | null>;

  findBySlug(slug: string): Promise<ApiCredentialRow | null>;

  findByOfficeIdAndSlug(
    officeId: string | null,
    slug: string,
  ): Promise<ApiCredentialRow | null>;

  getAll(): Promise<ApiCredentialRow[]>;

  getAllByClientId(clientId: string): Promise<ApiCredentialRow[]>;

  getAllByOfficeId(officeId: string): Promise<ApiCredentialRow[]>;
}