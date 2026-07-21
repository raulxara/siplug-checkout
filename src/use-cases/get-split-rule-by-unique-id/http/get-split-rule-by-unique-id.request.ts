import { IsOptional, IsString } from 'class-validator';

export class GetSplitRuleByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  splitRuleId?: string;

  @IsOptional()
  @IsString()
  _id?: string;
}
