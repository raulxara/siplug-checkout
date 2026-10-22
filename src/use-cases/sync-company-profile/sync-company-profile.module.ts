import { SecurityModule } from '../../modules/security/security.module';
import { Module } from '@nestjs/common';
import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { SyncCompanyProfileController } from './sync-company-profile.controller';
import { SyncCompanyProfileUseCase } from './sync-company-profile.use-case';
import { CompanyProfilesRepository } from './company-profiles.repository';
@Module({
  imports: [GetAuthContextModule, SecurityModule],
  controllers: [SyncCompanyProfileController],
  providers: [SyncCompanyProfileUseCase, CompanyProfilesRepository],
})
export class SyncCompanyProfileModule {}
