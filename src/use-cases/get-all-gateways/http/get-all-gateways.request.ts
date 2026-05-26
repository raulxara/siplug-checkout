import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetAllGatewaysRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @IsString()
  search?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  perPage?: number;
}