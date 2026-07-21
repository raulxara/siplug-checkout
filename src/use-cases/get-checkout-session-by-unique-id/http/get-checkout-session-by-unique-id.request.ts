import { IsOptional, IsString } from 'class-validator';

export class GetCheckoutSessionByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  checkoutSessionId!: string;
}