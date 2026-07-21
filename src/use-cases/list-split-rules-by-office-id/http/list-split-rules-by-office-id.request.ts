import { IsOptional, IsString } from 'class-validator';

export class ListSplitRulesByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}
