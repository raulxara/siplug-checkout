import { IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterSplitRecipientRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;

  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  gatewayId?: string;

  @IsOptional()
  @IsString()
  apiCredentialId?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  documentValue?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  gatewayProvider?: string;

  @IsOptional()
  @IsString()
  gatewayRecipientId?: string;

  @IsOptional()
  @IsString()
  gatewayAccountId?: string;

  @IsOptional()
  @IsObject()
  bankData?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  status?: string;
}
