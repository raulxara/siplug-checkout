"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCaseSupportModule = void 0;
const common_1 = require("@nestjs/common");
const log_provider_dispatch_module_1 = require("../log-provider-dispatch/log-provider-dispatch.module");
const handle_use_case_exception_service_1 = require("./handle-use-case-exception.service");
let UseCaseSupportModule = class UseCaseSupportModule {
};
exports.UseCaseSupportModule = UseCaseSupportModule;
exports.UseCaseSupportModule = UseCaseSupportModule = __decorate([
    (0, common_1.Module)({
        imports: [log_provider_dispatch_module_1.LogProviderDispatchModule],
        providers: [handle_use_case_exception_service_1.HandleUseCaseExceptionService],
        exports: [handle_use_case_exception_service_1.HandleUseCaseExceptionService],
    })
], UseCaseSupportModule);
//# sourceMappingURL=use-case-support.module.js.map