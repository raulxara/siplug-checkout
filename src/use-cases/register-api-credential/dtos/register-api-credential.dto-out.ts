import { CreateApiCredentialDtoOut } from '../../../modules/api-credentials/services/create-api-credential/dtos/create-api-credential.dto-out';

export class RegisterApiCredentialDtoOut {
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

  static fromCreateApiCredentialDtoOut(
    dtoOut: CreateApiCredentialDtoOut,
  ): RegisterApiCredentialDtoOut {
    return new RegisterApiCredentialDtoOut(
      dtoOut.id,
      dtoOut._id,
      dtoOut.officeId,
      dtoOut.clientId,
      dtoOut.gatewayId,
      dtoOut.name,
      dtoOut.slug,
      dtoOut.provider,
      dtoOut.providerType,
      dtoOut.environment,
      dtoOut.origin,
      dtoOut.config,
      dtoOut.expiresAt,
      dtoOut.changesHistory,
      dtoOut.status,
      dtoOut.createdAt,
      dtoOut.updatedAt,
    );
  }
}