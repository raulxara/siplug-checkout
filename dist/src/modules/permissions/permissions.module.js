"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const permissions_repository_1 = require("./repositories/permissions.repository");
const create_permission_service_1 = require("./services/create-permission/create-permission.service");
const find_permission_by_slug_service_1 = require("./services/find-permission-by-slug/find-permission-by-slug.service");
const find_permission_by_unique_id_service_1 = require("./services/find-permission-by-unique-id/find-permission-by-unique-id.service");
const get_all_permissions_by_office_id_service_1 = require("./services/get-all-permissions-by-office-id/get-all-permissions-by-office-id.service");
const get_all_permissions_by_unique_ids_service_1 = require("./services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service");
const get_all_permissions_service_1 = require("./services/get-all-permissions/get-all-permissions.service");
const update_permission_service_1 = require("./services/update-permission/update-permission.service");
const validate_permission_slug_uniqueness_service_1 = require("./services/validate-permission-slug-uniqueness/validate-permission-slug-uniqueness.service");
const permissions_tokens_1 = require("./tokens/permissions.tokens");
const list_permissions_by_office_id_service_1 = require("./services/list-permissions-by-office-id/list-permissions-by-office-id.service");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: permissions_tokens_1.PERMISSIONS_REPOSITORY,
                useClass: permissions_repository_1.PermissionsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_permission_service_1.CreatePermissionService,
            update_permission_service_1.UpdatePermissionService,
            find_permission_by_unique_id_service_1.FindPermissionByUniqueIdService,
            find_permission_by_slug_service_1.FindPermissionBySlugService,
            get_all_permissions_service_1.GetAllPermissionsService,
            get_all_permissions_by_office_id_service_1.GetAllPermissionsByOfficeIdService,
            get_all_permissions_by_unique_ids_service_1.GetAllPermissionsByUniqueIdsService,
            validate_permission_slug_uniqueness_service_1.ValidatePermissionSlugUniquenessService,
            list_permissions_by_office_id_service_1.ListPermissionsByOfficeIdService,
        ],
        exports: [
            permissions_tokens_1.PERMISSIONS_REPOSITORY,
            create_permission_service_1.CreatePermissionService,
            update_permission_service_1.UpdatePermissionService,
            find_permission_by_unique_id_service_1.FindPermissionByUniqueIdService,
            find_permission_by_slug_service_1.FindPermissionBySlugService,
            get_all_permissions_service_1.GetAllPermissionsService,
            get_all_permissions_by_office_id_service_1.GetAllPermissionsByOfficeIdService,
            get_all_permissions_by_unique_ids_service_1.GetAllPermissionsByUniqueIdsService,
            validate_permission_slug_uniqueness_service_1.ValidatePermissionSlugUniquenessService,
            list_permissions_by_office_id_service_1.ListPermissionsByOfficeIdService,
        ],
    })
], PermissionsModule);
//# sourceMappingURL=permissions.module.js.map