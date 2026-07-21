"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionPermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const position_permissions_repository_1 = require("./repositories/position-permissions.repository");
const create_position_permission_service_1 = require("./services/create-position-permission/create-position-permission.service");
const find_position_permission_by_position_and_permission_service_1 = require("./services/find-position-permission-by-position-and-permission/find-position-permission-by-position-and-permission.service");
const find_position_permission_by_unique_id_service_1 = require("./services/find-position-permission-by-unique-id/find-position-permission-by-unique-id.service");
const get_all_position_permissions_by_position_id_service_1 = require("./services/get-all-position-permissions-by-position-id/get-all-position-permissions-by-position-id.service");
const get_all_position_permissions_by_position_ids_service_1 = require("./services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service");
const get_all_position_permissions_service_1 = require("./services/get-all-position-permissions/get-all-position-permissions.service");
const update_position_permission_service_1 = require("./services/update-position-permission/update-position-permission.service");
const position_permissions_tokens_1 = require("./tokens/position-permissions.tokens");
let PositionPermissionsModule = class PositionPermissionsModule {
};
exports.PositionPermissionsModule = PositionPermissionsModule;
exports.PositionPermissionsModule = PositionPermissionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: position_permissions_tokens_1.POSITION_PERMISSIONS_REPOSITORY,
                useClass: position_permissions_repository_1.PositionPermissionsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_position_permission_service_1.CreatePositionPermissionService,
            update_position_permission_service_1.UpdatePositionPermissionService,
            find_position_permission_by_unique_id_service_1.FindPositionPermissionByUniqueIdService,
            find_position_permission_by_position_and_permission_service_1.FindPositionPermissionByPositionAndPermissionService,
            get_all_position_permissions_service_1.GetAllPositionPermissionsService,
            get_all_position_permissions_by_position_id_service_1.GetAllPositionPermissionsByPositionIdService,
            get_all_position_permissions_by_position_ids_service_1.GetAllPositionPermissionsByPositionIdsService,
        ],
        exports: [
            position_permissions_tokens_1.POSITION_PERMISSIONS_REPOSITORY,
            create_position_permission_service_1.CreatePositionPermissionService,
            update_position_permission_service_1.UpdatePositionPermissionService,
            find_position_permission_by_unique_id_service_1.FindPositionPermissionByUniqueIdService,
            find_position_permission_by_position_and_permission_service_1.FindPositionPermissionByPositionAndPermissionService,
            get_all_position_permissions_service_1.GetAllPositionPermissionsService,
            get_all_position_permissions_by_position_id_service_1.GetAllPositionPermissionsByPositionIdService,
            get_all_position_permissions_by_position_ids_service_1.GetAllPositionPermissionsByPositionIdsService,
        ],
    })
], PositionPermissionsModule);
//# sourceMappingURL=position-permissions.module.js.map