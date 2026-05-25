"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const positions_module_1 = require("../../modules/positions/positions.module");
const profiles_module_1 = require("../../modules/profiles/profiles.module");
const security_module_1 = require("../../modules/security/security.module");
const user_access_codes_module_1 = require("../../modules/user-access-codes/user-access-codes.module");
const user_customers_module_1 = require("../../modules/user-customers/user-customers.module");
const user_positions_module_1 = require("../../modules/user-positions/user-positions.module");
const get_user_controller_1 = require("./get-user.controller");
const get_user_use_case_1 = require("./get-user.use-case");
let GetUserModule = class GetUserModule {
};
exports.GetUserModule = GetUserModule;
exports.GetUserModule = GetUserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_customers_module_1.UserCustomersModule,
            clients_module_1.ClientsModule,
            profiles_module_1.ProfilesModule,
            user_positions_module_1.UserPositionsModule,
            positions_module_1.PositionsModule,
            user_access_codes_module_1.UserAccessCodesModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [get_user_controller_1.GetUserController],
        providers: [get_user_use_case_1.GetUserUseCase],
        exports: [get_user_use_case_1.GetUserUseCase],
    })
], GetUserModule);
//# sourceMappingURL=get-user.module.js.map