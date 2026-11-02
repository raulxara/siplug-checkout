import {BadRequestException,Body,Controller,Headers,HttpException,Post,Res,ServiceUnavailableException} from '@nestjs/common';
import type {Response} from 'express';
import {isUUID} from 'class-validator';
import {ProvisionCompanyRequest} from './dtos/provision-company.request';
import {ProvisionCompanyDtoIn} from './dtos/provision-company.dto-in';
import {ProvisionCompanyUseCase} from './provision-company.use-case';
@Controller('provision-office')
export class ProvisionCompanyController {
 constructor(private readonly useCase:ProvisionCompanyUseCase){}
 @Post() async create(@Body() body:ProvisionCompanyRequest,@Headers('authorization') authorization:string,@Headers('idempotency-key') key:string,@Res({passthrough:true}) response:Response){
  if(!isUUID(key))throw new BadRequestException();
  try{const data=await this.useCase.exec(new ProvisionCompanyDtoIn(authorization?.replace(/^Bearer /i,'')??'',key,body));response.setHeader('Cache-Control','no-store');return {success:true,data};}
  catch(error){if(error instanceof HttpException)throw error;throw new ServiceUnavailableException('Provisioning unavailable');}
 }
}
