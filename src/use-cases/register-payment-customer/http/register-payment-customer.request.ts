import { IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterPaymentCustomerRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;

  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  profileId?: string | null;

  @IsOptional()
  @IsString()
  externalReference?: string | null;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  documentType?: string | null;

  @IsOptional()
  @IsString()
  documentValue?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsObject()
  billingAddress?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string;
}