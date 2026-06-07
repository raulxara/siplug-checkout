import { IsOptional, IsString } from 'class-validator';

export class GetSplitRecipientByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  splitRecipientId?: string;

  @IsOptional()
  @IsString()
  _id?: string;
}
