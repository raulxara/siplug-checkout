import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  IsUUID,
  IsString,
  MaxLength,
  IsInt,
  Min,
  IsIn,
  IsEmail,
  ValidateNested,
  IsOptional,
  Matches,
  IsObject,
} from 'class-validator';
export class TeamPosition {
  @IsUUID() id!: string;
  @IsString() @MaxLength(100) name!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsIn(['active', 'inactive']) status!: 'active' | 'inactive';
  @IsArray()
  @ArrayMaxSize(100)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  permissions!: string[];
}
export class TeamProfile {
  @IsOptional() @IsString() @MaxLength(150) firstName?: string;
  @IsOptional() @IsString() @MaxLength(150) lastName?: string;
  @IsOptional() @IsObject() details?: Record<string, unknown>;
}
export class TeamMember {
  @IsOptional() @Matches(/^[1-9][0-9]{0,2}$/) phoneCountryCode?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamProfile)
  profile?: TeamProfile;
  @IsUUID() id!: string;
  @IsUUID() userId!: string;
  @IsString() @MaxLength(150) name!: string;
  @IsEmail() @MaxLength(255) email!: string;
  @IsString() @MaxLength(16) phone!: string;
  @IsIn(['active', 'inactive']) status!: 'active' | 'inactive';
  @IsArray()
  @ArrayMaxSize(100)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  positions!: string[];
}
export class SyncTeamRequest {
  @IsUUID() expectedOffice!: string;
  @IsUUID() revision!: string;
  @IsInt() @Min(1) version!: number;
  @IsArray()
  @ArrayMaxSize(100)
  @ArrayUnique((p) => p.id)
  @ValidateNested({ each: true })
  @Type(() => TeamPosition)
  positions!: TeamPosition[];
  @IsArray()
  @ArrayMaxSize(500)
  @ArrayUnique((m) => m.id)
  @ValidateNested({ each: true })
  @Type(() => TeamMember)
  members!: TeamMember[];
}
