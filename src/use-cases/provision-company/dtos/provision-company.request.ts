import {Type} from 'class-transformer';
import {IsEmail,IsIn,IsObject,IsOptional,IsString,MaxLength,MinLength,ValidateNested} from 'class-validator';
export class CompanyRequest {
 @IsString() @MinLength(1) @MaxLength(250) name!:string;
 @IsString() @MinLength(1) @MaxLength(100) slug!:string;
 @IsIn(['pt-BR']) language!:string;
 @IsIn(['BRL']) currency!:string;
}
export class ProvisionCompanyRequest {
 @IsString() @MinLength(1) @MaxLength(255) firstName!:string;
 @IsString() @MinLength(1) @MaxLength(255) lastName!:string;
 @IsEmail() @MaxLength(255) email!:string;
 @IsString() @MinLength(8) @MaxLength(30) phone!:string;
 @IsString() @MinLength(1) @MaxLength(255) username!:string;
 @IsString() @MinLength(12) @MaxLength(255) password!:string;
 @IsOptional() @IsString() @MaxLength(30) documentType?:string;
 @IsOptional() @IsString() @MaxLength(30) documentValue?:string;
 @IsObject() @ValidateNested() @Type(()=>CompanyRequest) office!:CompanyRequest;
}
