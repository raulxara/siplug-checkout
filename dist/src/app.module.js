"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./infra/database/prisma/prisma.module");
const health_module_1 = require("./modules/health/health.module");
const offices_module_1 = require("./modules/offices/offices.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const clients_module_1 = require("./modules/clients/clients.module");
const user_customers_module_1 = require("./modules/user-customers/user-customers.module");
const positions_module_1 = require("./modules/positions/positions.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const position_permissions_module_1 = require("./modules/position-permissions/position-permissions.module");
const user_positions_module_1 = require("./modules/user-positions/user-positions.module");
const security_module_1 = require("./modules/security/security.module");
const register_permission_module_1 = require("./use-cases/register-permission/register-permission.module");
const api_credentials_module_1 = require("./modules/api-credentials/api-credentials.module");
const register_api_credential_module_1 = require("./use-cases/register-api-credential/register-api-credential.module");
const register_position_module_1 = require("./use-cases/register-position/register-position.module");
const sync_position_permissions_module_1 = require("./use-cases/sync-position-permissions/sync-position-permissions.module");
const user_access_codes_module_1 = require("./modules/user-access-codes/user-access-codes.module");
const register_user_module_1 = require("./use-cases/register-user/register-user.module");
const update_user_module_1 = require("./use-cases/update-user/update-user.module");
const get_user_module_1 = require("./use-cases/get-user/get-user.module");
const list_users_module_1 = require("./use-cases/list-users/list-users.module");
const get_all_users_by_office_id_module_1 = require("./use-cases/get-all-users-by-office-id/get-all-users-by-office-id.module");
const update_api_credential_module_1 = require("./use-cases/update-api-credential/update-api-credential.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            offices_module_1.OfficesModule,
            profiles_module_1.ProfilesModule,
            clients_module_1.ClientsModule,
            user_customers_module_1.UserCustomersModule,
            positions_module_1.PositionsModule,
            permissions_module_1.PermissionsModule,
            position_permissions_module_1.PositionPermissionsModule,
            user_positions_module_1.UserPositionsModule,
            security_module_1.SecurityModule,
            register_permission_module_1.RegisterPermissionModule,
            register_api_credential_module_1.RegisterApiCredentialModule,
            api_credentials_module_1.ApiCredentialsModule,
            register_position_module_1.RegisterPositionModule,
            sync_position_permissions_module_1.SyncPositionPermissionsModule,
            user_access_codes_module_1.UserAccessCodesModule,
            register_user_module_1.RegisterUserModule,
            update_user_module_1.UpdateUserModule,
            get_user_module_1.GetUserModule,
            list_users_module_1.ListUsersModule,
            get_all_users_by_office_id_module_1.GetAllUsersByOfficeIdModule,
            update_api_credential_module_1.UpdateApiCredentialModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map