import { IsOptional, IsString } from 'class-validator';

export class ListSplitRulesRequest {
  @IsOptional()
  @IsString()
  token?: string;
}
