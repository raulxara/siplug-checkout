import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateGatewayRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  gatewayId!: string;

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
  description?: string | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @IsString()
  source?: string;
}