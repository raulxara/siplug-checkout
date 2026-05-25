import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { EncryptApiCredentialSecretService } from '../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service';
import { ApiCredentialsRepository } from './repositories/api-credentials.repository';
import { BuildApiCredentialConnectionDataService } from './services/build-api-credential-connection-data/build-api-credential-connection-data.service';
import { CreateApiCredentialService } from './services/create-api-credential/create-api-credential.service';
import { FindActiveApiCredentialBySlugService } from './services/find-active-api-credential-by-slug/find-active-api-credential-by-slug.service';
import { FindApiCredentialByUniqueIdService } from './services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { NormalizeApiCredentialConfigService } from './services/normalize-api-credential-config/normalize-api-credential-config.service';
import { UpdateApiCredentialService } from './services/update-api-credential/update-api-credential.service';
import { ValidateApiCredentialSlugUniquenessService } from './services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service';
import { API_CREDENTIALS_REPOSITORY } from './tokens/api-credentials.tokens';

@Module({
  providers: [
    {
      provide: API_CREDENTIALS_REPOSITORY,
      useClass: ApiCredentialsRepository,
    },
    BuildChangesHistoryService,
    DecryptApiCredentialSecretService,
    EncryptApiCredentialSecretService,
    FindActiveApiCredentialBySlugService,
    FindApiCredentialByUniqueIdService,
    BuildApiCredentialConnectionDataService,
    CreateApiCredentialService,
    UpdateApiCredentialService,
    ValidateApiCredentialSlugUniquenessService,
    NormalizeApiCredentialConfigService,
  ],
  exports: [
    API_CREDENTIALS_REPOSITORY,
    DecryptApiCredentialSecretService,
    EncryptApiCredentialSecretService,
    FindActiveApiCredentialBySlugService,
    FindApiCredentialByUniqueIdService,
    BuildApiCredentialConnectionDataService,
    CreateApiCredentialService,
    UpdateApiCredentialService,
    ValidateApiCredentialSlugUniquenessService,
    NormalizeApiCredentialConfigService,
  ],
})
export class ApiCredentialsModule {}