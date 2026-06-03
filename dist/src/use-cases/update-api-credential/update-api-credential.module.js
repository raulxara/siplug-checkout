"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApiCredentialModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const security_module_1 = require("../../modules/security/security.module");
const update_api_credential_controller_1 = require("./update-api-credential.controller");
const update_api_credential_use_case_1 = require("./update-api-credential.use-case");
let UpdateApiCredentialModule = class UpdateApiCredentialModule {
};
exports.UpdateApiCredentialModule = UpdateApiCredentialModule;
exports.UpdateApiCredentialModule = UpdateApiCredentialModule = __decorate([
    (0, common_1.Module)({
        imports: [
            api_credentials_module_1.ApiCredentialsModule,
            offices_module_1.OfficesModule,
            clients_module_1.ClientsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [update_api_credential_controller_1.UpdateApiCredentialController],
        providers: [update_api_credential_use_case_1.UpdateApiCredentialUseCase],
        exports: [update_api_credential_use_case_1.UpdateApiCredentialUseCase],
    })
], UpdateApiCredentialModule);
//# sourceMappingURL=update-api-credential.module.js.map