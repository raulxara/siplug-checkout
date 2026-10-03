import {ConflictException,ForbiddenException,Injectable} from '@nestjs/common';
import {PrismaService} from '../../infra/database/prisma/prisma.service';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {hash} from 'bcryptjs';
import {ProvisionCompanyRequest} from './dtos/provision-company.request';
import {ProvisionCompanyDtoOut} from './dtos/provision-company.dto-out';
@Injectable()
export class ProvisionCompanyRepository {
 constructor(private readonly db:PrismaService){}
 async create(actorClientId:string,key:string,data:ProvisionCompanyRequest):Promise<ProvisionCompanyDtoOut>{
  const source=process.env.SIPLUG_PROVISIONING_OFFICE_ID;
  if(!source)throw new ForbiddenException();
  const identity=await this.db.client.findFirst({where:{unique_id:actorClientId,office_id:source,status:'active'}});
  if(!identity)throw new ForbiddenException();
  const {password,...publicData}=data;const fingerprint=createHash('sha256').update(JSON.stringify(publicData)).digest('hex');
  const passwordHash=await hash(password,10);
  return this.db.$transaction(async tx=>{
   const lock=await tx.$queryRaw<Array<{_id:string}>>`SELECT _id FROM offices WHERE _id=${source} AND status='active' FOR UPDATE`;
   if(!lock.length)throw new ForbiddenException();
   const existing=await tx.office.findUnique({where:{unique_id:key}});
   if(existing){
    const config=existing.config as {source?:string;fingerprint?:string;userId?:string;customerId?:string}|null;
    if(existing.status!=='active'||config?.source!==source||config.fingerprint!==fingerprint||!config.customerId)throw new ConflictException();
    const customer=await tx.userCustomer.findUnique({where:{unique_id:config.customerId}});
    if(!customer||customer.status!=='active')throw new ConflictException();
    return new ProvisionCompanyDtoOut(key,customer.client_id,customer.unique_id,customer.token);
   }
   const userId=randomUUID(),profileId=randomUUID(),customerId=randomUUID(),positionId=randomUUID();
   const token=randomBytes(32).toString('hex');
   await tx.office.create({data:{unique_id:key,name:data.office.name,slug:data.office.slug+'-'+key.slice(0,8),language:'pt-BR',currency:'BRL',config:{source,fingerprint,userId,customerId}}});
   await tx.profile.create({data:{unique_id:profileId,first_name:data.firstName,last_name:data.lastName,email:data.email,phone:data.phone,document_type:data.documentType,document_value:data.documentValue}});
   await tx.client.create({data:{unique_id:userId,office_id:key,user_type:'customer',username:data.username,password:passwordHash,customer_id:customerId}});
   await tx.position.create({data:{unique_id:positionId,office_id:key,name:'Cliente',slug:'customer'}});
   await tx.userCustomer.create({data:{unique_id:customerId,client_id:userId,profile_id:profileId,token}});
   await tx.userPosition.create({data:{unique_id:randomUUID(),user_customer_id:customerId,position_id:positionId}});
   return new ProvisionCompanyDtoOut(key,userId,customerId,token);
  });
 }
}
