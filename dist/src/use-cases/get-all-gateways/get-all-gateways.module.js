"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllGatewaysModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const gateways_module_1 = require("../../modules/gateways/gateways.module");
const security_module_1 = require("../../modules/security/security.module");
const get_all_gateways_controller_1 = require("./get-all-gateways.controller");
const get_all_gateways_use_case_1 = require("./get-all-gateways.use-case");
let GetAllGatewaysModule = class GetAllGatewaysModule {
};
exports.GetAllGatewaysModule = GetAllGatewaysModule;
exports.GetAllGatewaysModule = GetAllGatewaysModule = __decorate([
    (0, common_1.Module)({
        imports: [gateways_module_1.GatewaysModule, security_module_1.SecurityModule, use_case_support_module_1.UseCaseSupportModule],
        controllers: [get_all_gateways_controller_1.GetAllGatewaysController],
        providers: [get_all_gateways_use_case_1.GetAllGatewaysUseCase],
        exports: [get_all_gateways_use_case_1.GetAllGatewaysUseCase],
    })
], GetAllGatewaysModule);
//# sourceMappingURL=get-all-gateways.module.js.map