import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateApiCredentialRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  apiCredentialId!: string;

  @IsOptional()
  @IsString()
  officeId?: string | null;

  @IsOptional()
  @IsString()
  clientId?: string | null;

  @IsOptional()
  @IsString()
  gatewayId?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  slug?: string | null;

  @IsOptional()
  @IsString()
  provider?: string | null;

  @IsOptional()
  @IsString()
  providerType?: string | null;

  @IsOptional()
  @IsString()
  environment?: string | null;

  @IsOptional()
  @IsString()
  providerToken?: string | null;

  @IsOptional()
  @IsString()
  origin?: string | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  expiresAt?: string | null;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @IsString()
  source?: string;
}