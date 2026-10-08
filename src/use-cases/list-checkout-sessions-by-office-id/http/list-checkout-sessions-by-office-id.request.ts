import { IsOptional, IsString, IsBoolean, IsObject } from 'class-validator';

export class ListCheckoutSessionsByOfficeIdRequest {
  @IsOptional() @IsBoolean() report?: boolean;
  @IsOptional()
  @IsObject()
  filters?: import('../../../modules/order-report/entities/order-report.entity').OrderReportFilters;
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}
