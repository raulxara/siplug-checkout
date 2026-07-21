import { Module } from '@nestjs/common';

import { BuildDecryptedApiCredentialResponseService } from '../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { ListApiCredentialByOfficeIdController } from './list-api-credential-by-office-id.controller';
import { ListApiCredentialByOfficeIdUseCase } from './list-api-credential-by-office-id.use-case';

@Module({
  imports: [ApiCredentialsModule, UseCaseSupportModule],
  controllers: [ListApiCredentialByOfficeIdController],
  providers: [
    BuildDecryptedApiCredentialResponseService,
    ListApiCredentialByOfficeIdUseCase,
  ],
  exports: [ListApiCredentialByOfficeIdUseCase],
})
export class ListApiCredentialByOfficeIdModule {}
