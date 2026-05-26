"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGatewayModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const gateways_module_1 = require("../../modules/gateways/gateways.module");
const security_module_1 = require("../../modules/security/security.module");
const update_gateway_controller_1 = require("./update-gateway.controller");
const update_gateway_use_case_1 = require("./update-gateway.use-case");
let UpdateGatewayModule = class UpdateGatewayModule {
};
exports.UpdateGatewayModule = UpdateGatewayModule;
exports.UpdateGatewayModule = UpdateGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [gateways_module_1.GatewaysModule, security_module_1.SecurityModule, use_case_support_module_1.UseCaseSupportModule],
        controllers: [update_gateway_controller_1.UpdateGatewayController],
        providers: [update_gateway_use_case_1.UpdateGatewayUseCase],
        exports: [update_gateway_use_case_1.UpdateGatewayUseCase],
    })
], UpdateGatewayModule);
//# sourceMappingURL=update-gateway.module.js.map