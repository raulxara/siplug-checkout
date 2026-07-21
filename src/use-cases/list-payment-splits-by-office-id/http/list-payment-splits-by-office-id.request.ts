import { IsOptional, IsString } from 'class-validator';

export class ListPaymentSplitsByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}
