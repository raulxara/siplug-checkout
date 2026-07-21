import { IsOptional, IsString } from 'class-validator';

export class ListSplitRecipientsByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}
