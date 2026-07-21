import type { ApiCredentialEntity } from '../../../entities/api-credential.entity';

export class CreateApiCredentialDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly officeId: string | null,
    public readonly clientId: string | null,
    public readonly gatewayId: string | null,
    public readonly name: string,
    public readonly slug: string,
    public readonly provider: string,
    public readonly providerType: string,
    public readonly environment: string,
    public readonly origin: string | null,
    public readonly config: Record<string, unknown> | null,
    public readonly expiresAt: string | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: ApiCredentialEntity): CreateApiCredentialDtoOut {
    return new CreateApiCredentialDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.officeId,
      entity.clientId,
      entity.gatewayId,
      entity.name,
      entity.slug,
      entity.provider,
      entity.providerType,
      entity.environment,
      entity.origin,
      entity.config,
      entity.expiresAt,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}