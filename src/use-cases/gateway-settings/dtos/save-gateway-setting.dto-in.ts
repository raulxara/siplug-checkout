import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Matches,
} from 'class-validator';
import type {
  Environment,
  PaymentMode,
} from '../../../modules/gateway-settings/entities/gateway-setting.entity';
export class SaveGatewaySettingDtoIn {
  @IsIn(['sandbox', 'production']) environment!: Environment;
  @IsIn(['active', 'inactive']) status!: 'active' | 'inactive';
  @IsOptional() @IsUUID() credentialId?: string;
  @IsOptional() @IsString() @MaxLength(64) version?: string;
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(4)
  @IsIn(['one_time', 'recurring', 'split', 'split_recurring'], { each: true })
  modes!: PaymentMode[];
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(4)
  @IsIn(['one_time', 'recurring', 'split', 'split_recurring'], { each: true })
  defaultModes!: PaymentMode[];
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Matches(/^[a-z][a-z0-9_]{0,63}$/, { each: true })
  paymentMethods?: string[];
  @IsOptional() @IsString() @MaxLength(2048) notificationUrl?: string;
  @IsObject() fields!: Record<string, string>;
}
