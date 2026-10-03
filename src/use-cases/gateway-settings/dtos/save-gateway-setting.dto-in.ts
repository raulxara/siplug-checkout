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
  @IsObject() fields!: Record<string, string>;
}
