import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class SyncPositionPermissionsRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  positionId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionIds!: string[];

  @IsOptional()
  @IsString()
  source?: string;
}