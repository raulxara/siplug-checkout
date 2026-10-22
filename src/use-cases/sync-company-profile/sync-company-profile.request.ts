import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
export class CompanyAddress {
  @IsOptional() @Matches(/^[0-9]{8}$/) cep?: string | null;
  @IsOptional() @IsString() @MaxLength(100) street?: string | null;
  @IsOptional() @IsString() @MaxLength(45) number?: string | null;
  @IsOptional() @IsString() @MaxLength(100) complement?: string | null;
  @IsOptional() @IsString() @MaxLength(100) district?: string | null;
  @IsOptional() @IsString() @MaxLength(100) city?: string | null;
  @IsOptional() @IsString() @MaxLength(45) state?: string | null;
  @Matches(/^[A-Z]{2}$/) country!: string;
}
export class SyncCompanyProfileRequest {
  @IsString() @IsNotEmpty() @MaxLength(255) expectedOffice!: string;
  @IsUUID() revision!: string;
  @IsInt() @Min(1) version!: number;
  @IsString() @IsNotEmpty() @MaxLength(250) name!: string;
  @IsOptional() @IsString() @MaxLength(250) legalName?: string | null;
  @IsOptional() @Matches(/^([0-9]{11}|[0-9]{14})$/) document?: string | null;
  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  @MaxLength(250)
  email?: string | null;
  @IsOptional() @Matches(/^\+?[1-9][0-9]{7,14}$/) phone?: string | null;
  @IsDefined()
  @ValidateNested()
  @Type(() => CompanyAddress)
  address!: CompanyAddress;
}
