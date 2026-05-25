"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCredentialsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const encrypt_api_credential_secret_service_1 = require("../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service");
const api_credentials_repository_1 = require("./repositories/api-credentials.repository");
const build_api_credential_connection_data_service_1 = require("./services/build-api-credential-connection-data/build-api-credential-connection-data.service");
const create_api_credential_service_1 = require("./services/create-api-credential/create-api-credential.service");
const find_active_api_credential_by_slug_service_1 = require("./services/find-active-api-credential-by-slug/find-active-api-credential-by-slug.service");
const find_api_credential_by_unique_id_service_1 = require("./services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const normalize_api_credential_config_service_1 = require("./services/normalize-api-credential-config/normalize-api-credential-config.service");
const update_api_credential_service_1 = require("./services/update-api-credential/update-api-credential.service");
const validate_api_credential_slug_uniqueness_service_1 = require("./services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service");
const api_credentials_tokens_1 = require("./tokens/api-credentials.tokens");
let ApiCredentialsModule = class ApiCredentialsModule {
};
exports.ApiCredentialsModule = ApiCredentialsModule;
exports.ApiCredentialsModule = ApiCredentialsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: api_credentials_tokens_1.API_CREDENTIALS_REPOSITORY,
                useClass: api_credentials_repository_1.ApiCredentialsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
            encrypt_api_credential_secret_service_1.EncryptApiCredentialSecretService,
            find_active_api_credential_by_slug_service_1.FindActiveApiCredentialBySlugService,
            find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
            build_api_credential_connection_data_service_1.BuildApiCredentialConnectionDataService,
            create_api_credential_service_1.CreateApiCredentialService,
            update_api_credential_service_1.UpdateApiCredentialService,
            validate_api_credential_slug_uniqueness_service_1.ValidateApiCredentialSlugUniquenessService,
            normalize_api_credential_config_service_1.NormalizeApiCredentialConfigService,
        ],
        exports: [
            api_credentials_tokens_1.API_CREDENTIALS_REPOSITORY,
            decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
            encrypt_api_credential_secret_service_1.EncryptApiCredentialSecretService,
            find_active_api_credential_by_slug_service_1.FindActiveApiCredentialBySlugService,
            find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
            build_api_credential_connection_data_service_1.BuildApiCredentialConnectionDataService,
            create_api_credential_service_1.CreateApiCredentialService,
            update_api_credential_service_1.UpdateApiCredentialService,
            validate_api_credential_slug_uniqueness_service_1.ValidateApiCredentialSlugUniquenessService,
            normalize_api_credential_config_service_1.NormalizeApiCredentialConfigService,
        ],
    })
], ApiCredentialsModule);
//# sourceMappingURL=api-credentials.module.js.map