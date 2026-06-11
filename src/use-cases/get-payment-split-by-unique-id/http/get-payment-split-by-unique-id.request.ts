import { IsOptional, IsString } from 'class-validator';

export class GetPaymentSplitByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  paymentSplitId?: string;

  @IsOptional()
  @IsString()
  _id?: string;
}
