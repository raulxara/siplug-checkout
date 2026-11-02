import { IsISO8601, IsInt, Min, Max, IsOptional, IsIn } from 'class-validator';
export class FiscalPaymentsDto {
  @IsOptional() @IsIn(['transactions', 'invoices']) source?:
    | 'transactions'
    | 'invoices';
  @IsISO8601() since!: string;
  @IsOptional() @IsInt() @Min(1) @Max(100000) page?: number;
}
