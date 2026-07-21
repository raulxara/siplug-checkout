"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogProviderDispatchModule = void 0;
const common_1 = require("@nestjs/common");
const api_credentials_module_1 = require("../../../modules/api-credentials/api-credentials.module");
const dispatch_log_provider_service_1 = require("./dispatch-log-provider.service");
let LogProviderDispatchModule = class LogProviderDispatchModule {
};
exports.LogProviderDispatchModule = LogProviderDispatchModule;
exports.LogProviderDispatchModule = LogProviderDispatchModule = __decorate([
    (0, common_1.Module)({
        imports: [api_credentials_module_1.ApiCredentialsModule],
        providers: [dispatch_log_provider_service_1.DispatchLogProviderService],
        exports: [dispatch_log_provider_service_1.DispatchLogProviderService],
    })
], LogProviderDispatchModule);
//# sourceMappingURL=log-provider-dispatch.module.js.map