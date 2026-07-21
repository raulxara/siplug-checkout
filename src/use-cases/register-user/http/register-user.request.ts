import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterUserRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;

  @IsOptional()
  @IsString()
  positionSlug?: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  documentType?: string | null;

  @IsOptional()
  @IsString()
  documentValue?: string | null;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  userType?: string;

  @IsOptional()
  @IsBoolean()
  twoFaRequired?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  twoFaChannels?: string[];

  @IsOptional()
  @IsObject()
  profileConfig?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  clientConfig?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  userCustomerConfig?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string;
}