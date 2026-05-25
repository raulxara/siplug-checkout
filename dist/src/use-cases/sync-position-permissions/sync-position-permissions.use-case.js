"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPositionPermissionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const get_all_permissions_by_unique_ids_dto_in_1 = require("../../modules/permissions/services/get-all-permissions-by-unique-ids/dtos/get-all-permissions-by-unique-ids.dto-in");
const get_all_permissions_by_unique_ids_service_1 = require("../../modules/permissions/services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service");
const create_position_permission_dto_in_1 = require("../../modules/position-permissions/services/create-position-permission/dtos/create-position-permission.dto-in");
const create_position_permission_service_1 = require("../../modules/position-permissions/services/create-position-permission/create-position-permission.service");
const get_all_position_permissions_by_position_id_dto_in_1 = require("../../modules/position-permissions/services/get-all-position-permissions-by-position-id/dtos/get-all-position-permissions-by-position-id.dto-in");
const get_all_position_permissions_by_position_id_service_1 = require("../../modules/position-permissions/services/get-all-position-permissions-by-position-id/get-all-position-permissions-by-position-id.service");
const update_position_permission_dto_in_1 = require("../../modules/position-permissions/services/update-position-permission/dtos/update-position-permission.dto-in");
const update_position_permission_service_1 = require("../../modules/position-permissions/services/update-position-permission/update-position-permission.service");
const find_position_by_unique_id_dto_in_1 = require("../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in");
const find_position_by_unique_id_service_1 = require("../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const sync_position_permissions_dto_out_1 = require("./dtos/sync-position-permissions.dto-out");
let SyncPositionPermissionsUseCase = class SyncPositionPermissionsUseCase {
    resolveActorAuthorizationService;
    findPositionByUniqueIdService;
    getAllPermissionsByUniqueIdsService;
    getAllPositionPermissionsByPositionIdService;
    createPositionPermissionService;
    updatePositionPermissionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findPositionByUniqueIdService, getAllPermissionsByUniqueIdsService, getAllPositionPermissionsByPositionIdService, createPositionPermissionService, updatePositionPermissionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findPositionByUniqueIdService = findPositionByUniqueIdService;
        this.getAllPermissionsByUniqueIdsService = getAllPermissionsByUniqueIdsService;
        this.getAllPositionPermissionsByPositionIdService = getAllPositionPermissionsByPositionIdService;
        this.createPositionPermissionService = createPositionPermissionService;
        this.updatePositionPermissionService = updatePositionPermissionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'syncPositionPermissions',
                requiredEntity: 'position_permissions',
            }));
            const positionDtoOut = await this.findPositionByUniqueIdService.exec(new find_position_by_unique_id_dto_in_1.FindPositionByUniqueIdDtoIn(dtoIn.positionId));
            if (positionDtoOut.position.status !== 'active') {
                throw new Error('position is not active');
            }
            const permissionsDtoOut = await this.getAllPermissionsByUniqueIdsService.exec(new get_all_permissions_by_unique_ids_dto_in_1.GetAllPermissionsByUniqueIdsDtoIn(dtoIn.permissionIds));
            const foundPermissionIds = permissionsDtoOut.items.map((item) => item._id);
            const missingPermissionIds = dtoIn.permissionIds.filter((permissionId) => !foundPermissionIds.includes(permissionId));
            if (missingPermissionIds.length > 0) {
                throw new Error(`permissions not found: ${missingPermissionIds.join(', ')}`);
            }
            const inactivePermissions = permissionsDtoOut.items.filter((item) => item.status !== 'active');
            if (inactivePermissions.length > 0) {
                throw new Error(`permissions are not active: ${inactivePermissions
                    .map((item) => item._id)
                    .join(', ')}`);
            }
            const currentPositionPermissionsDtoOut = await this.getAllPositionPermissionsByPositionIdService.exec(new get_all_position_permissions_by_position_id_dto_in_1.GetAllPositionPermissionsByPositionIdDtoIn(dtoIn.positionId));
            const requestedPermissionIds = [...new Set(dtoIn.permissionIds)];
            const created = [];
            const activated = [];
            const inactivated = [];
            const kept = [];
            const currentByPermissionId = new Map(currentPositionPermissionsDtoOut.items.map((item) => [
                item.permissionId,
                item,
            ]));
            for (const permissionId of requestedPermissionIds) {
                const current = currentByPermissionId.get(permissionId);
                if (!current) {
                    const createdDtoOut = await this.createPositionPermissionService.exec(new create_position_permission_dto_in_1.CreatePositionPermissionDtoIn({
                        positionId: dtoIn.positionId,
                        permissionId,
                        config: {
                            source: dtoIn.source,
                        },
                        status: 'active',
                    }));
                    created.push({
                        id: createdDtoOut.id,
                        _id: createdDtoOut._id,
                        positionId: createdDtoOut.positionId,
                        permissionId: createdDtoOut.permissionId,
                        config: createdDtoOut.config,
                        changesHistory: createdDtoOut.changesHistory,
                        status: createdDtoOut.status,
                        createdAt: createdDtoOut.createdAt,
                        updatedAt: createdDtoOut.updatedAt,
                    });
                    continue;
                }
                if (current.status !== 'active') {
                    const activatedDtoOut = await this.updatePositionPermissionService.exec(new update_position_permission_dto_in_1.UpdatePositionPermissionDtoIn({
                        _id: current._id,
                        status: 'active',
                        source: dtoIn.source,
                    }));
                    activated.push(activatedDtoOut.positionPermission);
                    continue;
                }
                kept.push(current);
            }
            for (const current of currentPositionPermissionsDtoOut.items) {
                const shouldRemainActive = requestedPermissionIds.includes(current.permissionId);
                if (shouldRemainActive) {
                    continue;
                }
                if (current.status !== 'active') {
                    continue;
                }
                const inactivatedDtoOut = await this.updatePositionPermissionService.exec(new update_position_permission_dto_in_1.UpdatePositionPermissionDtoIn({
                    _id: current._id,
                    status: 'inactive',
                    source: dtoIn.source,
                }));
                inactivated.push(inactivatedDtoOut.positionPermission);
            }
            return new sync_position_permissions_dto_out_1.SyncPositionPermissionsDtoOut(positionDtoOut.position, permissionsDtoOut.items, requestedPermissionIds, created, activated, inactivated, kept, requestedPermissionIds.length, created.length, activated.length, inactivated.length, kept.length);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'SyncPositionPermissionsUseCase',
                error,
                appFile: __filename,
                context: {
                    positionId: dtoIn.positionId,
                    permissionIds: dtoIn.permissionIds,
                    source: dtoIn.source,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on sync position permissions use case';
            throw new Error(message);
        }
    }
};
exports.SyncPositionPermissionsUseCase = SyncPositionPermissionsUseCase;
exports.SyncPositionPermissionsUseCase = SyncPositionPermissionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_position_by_unique_id_service_1.FindPositionByUniqueIdService,
        get_all_permissions_by_unique_ids_service_1.GetAllPermissionsByUniqueIdsService,
        get_all_position_permissions_by_position_id_service_1.GetAllPositionPermissionsByPositionIdService,
        create_position_permission_service_1.CreatePositionPermissionService,
        update_position_permission_service_1.UpdatePositionPermissionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], SyncPositionPermissionsUseCase);
//# sourceMappingURL=sync-position-permissions.use-case.js.map