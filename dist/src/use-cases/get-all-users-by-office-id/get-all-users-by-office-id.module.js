"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersByOfficeIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const positions_module_1 = require("../../modules/positions/positions.module");
const profiles_module_1 = require("../../modules/profiles/profiles.module");
const security_module_1 = require("../../modules/security/security.module");
const user_customers_module_1 = require("../../modules/user-customers/user-customers.module");
const user_positions_module_1 = require("../../modules/user-positions/user-positions.module");
const get_all_users_by_office_id_controller_1 = require("./get-all-users-by-office-id.controller");
const get_all_users_by_office_id_use_case_1 = require("./get-all-users-by-office-id.use-case");
let GetAllUsersByOfficeIdModule = class GetAllUsersByOfficeIdModule {
};
exports.GetAllUsersByOfficeIdModule = GetAllUsersByOfficeIdModule;
exports.GetAllUsersByOfficeIdModule = GetAllUsersByOfficeIdModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            clients_module_1.ClientsModule,
            user_customers_module_1.UserCustomersModule,
            profiles_module_1.ProfilesModule,
            user_positions_module_1.UserPositionsModule,
            positions_module_1.PositionsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [get_all_users_by_office_id_controller_1.GetAllUsersByOfficeIdController],
        providers: [get_all_users_by_office_id_use_case_1.GetAllUsersByOfficeIdUseCase],
        exports: [get_all_users_by_office_id_use_case_1.GetAllUsersByOfficeIdUseCase],
    })
], GetAllUsersByOfficeIdModule);
//# sourceMappingURL=get-all-users-by-office-id.module.js.map