"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterApiCredentialModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const api_credentials_module_1 = require("../../modules/api-credentials/api-credentials.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const security_module_1 = require("../../modules/security/security.module");
const register_api_credential_controller_1 = require("./register-api-credential.controller");
const register_api_credential_use_case_1 = require("./register-api-credential.use-case");
let RegisterApiCredentialModule = class RegisterApiCredentialModule {
};
exports.RegisterApiCredentialModule = RegisterApiCredentialModule;
exports.RegisterApiCredentialModule = RegisterApiCredentialModule = __decorate([
    (0, common_1.Module)({
        imports: [
            api_credentials_module_1.ApiCredentialsModule,
            offices_module_1.OfficesModule,
            clients_module_1.ClientsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [register_api_credential_controller_1.RegisterApiCredentialController],
        providers: [register_api_credential_use_case_1.RegisterApiCredentialUseCase],
        exports: [register_api_credential_use_case_1.RegisterApiCredentialUseCase],
    })
], RegisterApiCredentialModule);
//# sourceMappingURL=register-api-credential.module.js.map