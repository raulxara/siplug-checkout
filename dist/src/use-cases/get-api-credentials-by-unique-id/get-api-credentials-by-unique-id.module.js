"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetApiCredentialsByUniqueIdModule = void 0;
const common_1 = require("@nestjs/common");
const build_decrypted_api_credential_response_service_1 = require("../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const get_api_credentials_by_unique_id_controller_1 = require("./get-api-credentials-by-unique-id.controller");
const get_api_credentials_by_unique_id_use_case_1 = require("./get-api-credentials-by-unique-id.use-case");
let GetApiCredentialsByUniqueIdModule = class GetApiCredentialsByUniqueIdModule {
};
exports.GetApiCredentialsByUniqueIdModule = GetApiCredentialsByUniqueIdModule;
exports.GetApiCredentialsByUniqueIdModule = GetApiCredentialsByUniqueIdModule = __decorate([
    (0, common_1.Module)({
        imports: [api_credentials_module_1.ApiCredentialsModule, use_case_support_module_1.UseCaseSupportModule],
        controllers: [get_api_credentials_by_unique_id_controller_1.GetApiCredentialsByUniqueIdController],
        providers: [
            build_decrypted_api_credential_response_service_1.BuildDecryptedApiCredentialResponseService,
            get_api_credentials_by_unique_id_use_case_1.GetApiCredentialsByUniqueIdUseCase,
        ],
        exports: [get_api_credentials_by_unique_id_use_case_1.GetApiCredentialsByUniqueIdUseCase],
    })
], GetApiCredentialsByUniqueIdModule);
//# sourceMappingURL=get-api-credentials-by-unique-id.module.js.map