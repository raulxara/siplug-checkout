import {ForbiddenException,Injectable} from '@nestjs/common';
import {ResolveActorAuthorizationService} from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import {ResolveActorAuthorizationDtoIn} from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import {ProvisionCompanyRepository} from './provision-company.repository';
import {ProvisionCompanyDtoIn} from './dtos/provision-company.dto-in';
@Injectable()
export class ProvisionCompanyUseCase {
 constructor(private readonly auth:ResolveActorAuthorizationService,private readonly repository:ProvisionCompanyRepository){}
 async exec(input:ProvisionCompanyDtoIn){
  const actor=await this.auth.exec(new ResolveActorAuthorizationDtoIn({token:input.token,requiredAction:'provision',requiredEntity:'office'})).catch(()=>{throw new ForbiddenException();});
  return this.repository.create(actor.actor.clientId,input.key,input.data);
 }
}
