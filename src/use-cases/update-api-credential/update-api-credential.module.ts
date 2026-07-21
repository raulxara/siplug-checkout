import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UpdateApiCredentialController } from './update-api-credential.controller';
import { UpdateApiCredentialUseCase } from './update-api-credential.use-case';

@Module({
  imports: [
    ApiCredentialsModule,
    OfficesModule,
    ClientsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [UpdateApiCredentialController],
  providers: [UpdateApiCredentialUseCase],
  exports: [UpdateApiCredentialUseCase],
})
export class UpdateApiCredentialModule {}