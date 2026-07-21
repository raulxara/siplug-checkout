import { IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterApiCredentialRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  officeId?: string | null;

  @IsOptional()
  @IsString()
  clientId?: string | null;

  @IsOptional()
  @IsString()
  gatewayId?: string | null;

  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsString()
  provider!: string;

  @IsString()
  providerType!: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsString()
  providerToken!: string;

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
  status?: string;
}