import { IsOptional, IsString } from 'class-validator';

export class ListCheckoutSessionsByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}
