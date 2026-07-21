import { IsOptional, IsString } from 'class-validator';

export class ListSplitRecipientsRequest {
  @IsOptional()
  @IsString()
  token?: string;
}
