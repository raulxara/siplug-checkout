import {Module} from '@nestjs/common';
import {SecurityModule} from '../../modules/security/security.module';
import {ProvisionCompanyRepository} from './provision-company.repository';
import {ProvisionCompanyUseCase} from './provision-company.use-case';
import {ProvisionCompanyController} from './provision-company.controller';
@Module({imports:[SecurityModule],providers:[ProvisionCompanyRepository,ProvisionCompanyUseCase],controllers:[ProvisionCompanyController]})
export class ProvisionCompanyModule {}
