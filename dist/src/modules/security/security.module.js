"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const permissions_module_1 = require("../permissions/permissions.module");
const position_permissions_module_1 = require("../position-permissions/position-permissions.module");
const positions_module_1 = require("../positions/positions.module");
const user_customers_module_1 = require("../user-customers/user-customers.module");
const user_positions_module_1 = require("../user-positions/user-positions.module");
const check_user_permission_service_1 = require("./services/check-user-permission/check-user-permission.service");
const resolve_actor_authorization_service_1 = require("./services/resolve-actor-authorization/resolve-actor-authorization.service");
let SecurityModule = class SecurityModule {
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_customers_module_1.UserCustomersModule,
            user_positions_module_1.UserPositionsModule,
            positions_module_1.PositionsModule,
            position_permissions_module_1.PositionPermissionsModule,
            permissions_module_1.PermissionsModule,
        ],
        providers: [check_user_permission_service_1.CheckUserPermissionService, resolve_actor_authorization_service_1.ResolveActorAuthorizationService],
        exports: [check_user_permission_service_1.CheckUserPermissionService, resolve_actor_authorization_service_1.ResolveActorAuthorizationService],
    })
], SecurityModule);
//# sourceMappingURL=security.module.js.map