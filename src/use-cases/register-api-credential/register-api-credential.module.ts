import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { SecurityModule } from '../../modules/security/security.module';
import { RegisterApiCredentialController } from './register-api-credential.controller';
import { RegisterApiCredentialUseCase } from './register-api-credential.use-case';

@Module({
  imports: [
    ApiCredentialsModule,
    OfficesModule,
    ClientsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [RegisterApiCredentialController],
  providers: [RegisterApiCredentialUseCase],
  exports: [RegisterApiCredentialUseCase],
})
export class RegisterApiCredentialModule {}