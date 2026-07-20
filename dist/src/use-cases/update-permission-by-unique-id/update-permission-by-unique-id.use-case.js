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
exports.UpdatePermissionByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_permission_by_unique_id_dto_in_1 = require("../../modules/permissions/services/find-permission-by-unique-id/dtos/find-permission-by-unique-id.dto-in");
const find_permission_by_unique_id_service_1 = require("../../modules/permissions/services/find-permission-by-unique-id/find-permission-by-unique-id.service");
const update_permission_dto_in_1 = require("../../modules/permissions/services/update-permission/dtos/update-permission.dto-in");
const update_permission_service_1 = require("../../modules/permissions/services/update-permission/update-permission.service");
const update_permission_by_unique_id_dto_out_1 = require("./dtos/update-permission-by-unique-id.dto-out");
let UpdatePermissionByUniqueIdUseCase = class UpdatePermissionByUniqueIdUseCase {
    findPermissionByUniqueIdService;
    updatePermissionService;
    handleUseCaseExceptionService;
    constructor(findPermissionByUniqueIdService, updatePermissionService, handleUseCaseExceptionService) {
        this.findPermissionByUniqueIdService = findPermissionByUniqueIdService;
        this.updatePermissionService = updatePermissionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const currentPermissionDtoOut = await this.findPermissionByUniqueIdService.exec(new find_permission_by_unique_id_dto_in_1.FindPermissionByUniqueIdDtoIn(dtoIn.permissionId));
            const currentPermission = currentPermissionDtoOut.permission;
            if (dtoIn.officeId !== undefined &&
                currentPermission.officeId !== null &&
                currentPermission.officeId !== dtoIn.officeId) {
                throw new Error('permission does not belong to informed officeId');
            }
            const updatedPermissionDtoOut = await this.updatePermissionService.exec(new update_permission_dto_in_1.UpdatePermissionDtoIn({
                _id: dtoIn.permissionId,
                officeId: dtoIn.officeId,
                name: dtoIn.name,
                slug: dtoIn.slug,
                description: dtoIn.description,
                entity: dtoIn.entity,
                action: dtoIn.action,
                config: dtoIn.config,
                status: dtoIn.status,
                source: 'UpdatePermissionByUniqueIdController',
            }));
            return new update_permission_by_unique_id_dto_out_1.UpdatePermissionByUniqueIdDtoOut({
                ...updatedPermissionDtoOut.permission,
            });
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdatePermissionByUniqueIdUseCase',
                error,
                appFile: __filename,
                context: {
                    permissionId: dtoIn.permissionId,
                    officeId: dtoIn.officeId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update permission by unique id use case';
            throw new Error(message);
        }
    }
};
exports.UpdatePermissionByUniqueIdUseCase = UpdatePermissionByUniqueIdUseCase;
exports.UpdatePermissionByUniqueIdUseCase = UpdatePermissionByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_permission_by_unique_id_service_1.FindPermissionByUniqueIdService,
        update_permission_service_1.UpdatePermissionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdatePermissionByUniqueIdUseCase);
//# sourceMappingURL=update-permission-by-unique-id.use-case.js.map