import { IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterPermissionRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  officeId?: string | null;

  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsString()
  entity!: string;

  @IsString()
  action!: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string;
}