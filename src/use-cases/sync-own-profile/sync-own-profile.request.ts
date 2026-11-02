import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
export class Address {
  @IsString() @MaxLength(255) cep!: string;
  @IsString() @MaxLength(255) street!: string;
  @IsString() @MaxLength(100) number!: string;
  @IsString() @MaxLength(255) complement!: string;
  @IsString() @MaxLength(255) district!: string;
  @IsString() @MaxLength(150) city!: string;
  @IsString() @MaxLength(100) state!: string;
  @IsString() @MaxLength(100) country!: string;
}
export class Notifications {
  @IsBoolean() system!: boolean;
  @IsBoolean() sales!: boolean;
  @IsBoolean() tips!: boolean;
  @IsBoolean() marketing!: boolean;
}
export class Details {
  @IsOptional() @IsString() @MaxLength(150) role?: string;
  @IsOptional() @IsString() @MaxLength(350000) avatar?: string | null;
  @IsDefined() @ValidateNested() @Type(() => Address) billing!: Address;
  @IsDefined() @ValidateNested() @Type(() => Address) shipping!: Address;
  @IsBoolean() sameAsBilling!: boolean;
  @IsDefined()
  @ValidateNested()
  @Type(() => Notifications)
  notifications!: Notifications;
}
export class SyncOwnProfileRequest {
  @IsString() @IsNotEmpty() @MaxLength(255) expectedSubject!: string;
  @IsUUID() revision!: string;
  @IsString() @IsNotEmpty() @MaxLength(255) firstName!: string;
  @IsString() @MaxLength(255) lastName!: string;
  @IsEmail() @MaxLength(255) email!: string;
  @IsString() @Matches(/^\+?[1-9][0-9]{7,14}$/) phone!: string;
  @IsDefined() @ValidateNested() @Type(() => Details) details!: Details;
}
