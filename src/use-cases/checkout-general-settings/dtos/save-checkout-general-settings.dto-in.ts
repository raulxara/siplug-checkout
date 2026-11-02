import { IsIn, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
export class SaveCheckoutGeneralSettingsDtoIn {
  @IsIn(['BRL']) currency!: 'BRL';
  @IsIn(['sandbox', 'production']) environment!: 'sandbox' | 'production';
  @IsString() @MaxLength(2048) successUrl!: string;
  @IsString() @MaxLength(2048) cancelUrl!: string;
  @IsInt() @Min(30) @Max(1440) sessionDurationMinutes!: number;
  @IsString() @MaxLength(64) version!: string;
}
