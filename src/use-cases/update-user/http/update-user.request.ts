import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  userCustomerId!: string;

  @IsOptional()
  @IsString()
  officeId?: string | null;

  @IsOptional()
  @IsString()
  positionSlug?: string | null;

  @IsOptional()
  @IsString()
  firstName?: string | null;

  @IsOptional()
  @IsString()
  lastName?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  documentType?: string | null;

  @IsOptional()
  @IsString()
  documentValue?: string | null;

  @IsOptional()
  @IsString()
  username?: string | null;

  @IsOptional()
  @IsString()
  password?: string | null;

  @IsOptional()
  @IsString()
  userType?: string | null;

  @IsOptional()
  @IsBoolean()
  twoFaRequired?: boolean | null;

  @IsOptional()
  @IsBoolean()
  twoFaActive?: boolean | null;

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
  status?: string | null;

  @IsOptional()
  @IsString()
  source?: string;
}