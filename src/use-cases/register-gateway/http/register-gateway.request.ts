import { IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterGatewayRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsString()
  provider!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string;
}