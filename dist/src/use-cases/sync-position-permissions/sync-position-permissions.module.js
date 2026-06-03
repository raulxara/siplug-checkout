"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPositionPermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const permissions_module_1 = require("../../modules/permissions/permissions.module");
const position_permissions_module_1 = require("../../modules/position-permissions/position-permissions.module");
const positions_module_1 = require("../../modules/positions/positions.module");
const security_module_1 = require("../../modules/security/security.module");
const sync_position_permissions_controller_1 = require("./sync-position-permissions.controller");
const sync_position_permissions_use_case_1 = require("./sync-position-permissions.use-case");
let SyncPositionPermissionsModule = class SyncPositionPermissionsModule {
};
exports.SyncPositionPermissionsModule = SyncPositionPermissionsModule;
exports.SyncPositionPermissionsModule = SyncPositionPermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            positions_module_1.PositionsModule,
            permissions_module_1.PermissionsModule,
            position_permissions_module_1.PositionPermissionsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [sync_position_permissions_controller_1.SyncPositionPermissionsController],
        providers: [sync_position_permissions_use_case_1.SyncPositionPermissionsUseCase],
        exports: [sync_position_permissions_use_case_1.SyncPositionPermissionsUseCase],
    })
], SyncPositionPermissionsModule);
//# sourceMappingURL=sync-position-permissions.module.js.map