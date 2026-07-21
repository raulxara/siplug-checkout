import { Module } from '@nestjs/common';

import { BuildDecryptedApiCredentialResponseService } from '../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { GetApiCredentialsByUniqueIdController } from './get-api-credentials-by-unique-id.controller';
import { GetApiCredentialsByUniqueIdUseCase } from './get-api-credentials-by-unique-id.use-case';

@Module({
  imports: [ApiCredentialsModule, UseCaseSupportModule],
  controllers: [GetApiCredentialsByUniqueIdController],
  providers: [
    BuildDecryptedApiCredentialResponseService,
    GetApiCredentialsByUniqueIdUseCase,
  ],
  exports: [GetApiCredentialsByUniqueIdUseCase],
})
export class GetApiCredentialsByUniqueIdModule {}
