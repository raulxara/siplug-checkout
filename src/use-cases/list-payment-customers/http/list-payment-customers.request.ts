import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListPaymentCustomersRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;

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