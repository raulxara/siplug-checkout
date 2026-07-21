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
exports.ListPermissionPositionByPositionIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const get_all_position_permissions_by_position_ids_dto_in_1 = require("../../modules/position-permissions/services/get-all-position-permissions-by-position-ids/dtos/get-all-position-permissions-by-position-ids.dto-in");
const get_all_position_permissions_by_position_ids_service_1 = require("../../modules/position-permissions/services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service");
const find_position_by_unique_id_dto_in_1 = require("../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in");
const find_position_by_unique_id_service_1 = require("../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service");
const list_permission_position_by_position_id_dto_out_1 = require("./dtos/list-permission-position-by-position-id.dto-out");
let ListPermissionPositionByPositionIdUseCase = class ListPermissionPositionByPositionIdUseCase {
    findPositionByUniqueIdService;
    getAllPositionPermissionsByPositionIdsService;
    handleUseCaseExceptionService;
    constructor(findPositionByUniqueIdService, getAllPositionPermissionsByPositionIdsService, handleUseCaseExceptionService) {
        this.findPositionByUniqueIdService = findPositionByUniqueIdService;
        this.getAllPositionPermissionsByPositionIdsService = getAllPositionPermissionsByPositionIdsService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const positionDtoOut = await this.findPositionByUniqueIdService.exec(new find_position_by_unique_id_dto_in_1.FindPositionByUniqueIdDtoIn(dtoIn.positionId));
            const position = positionDtoOut.position;
            if (dtoIn.officeId !== undefined &&
                position.officeId !== null &&
                position.officeId !== dtoIn.officeId) {
                throw new Error('position does not belong to informed officeId');
            }
            const positionPermissionsDtoOut = await this.getAllPositionPermissionsByPositionIdsService.exec(new get_all_position_permissions_by_position_ids_dto_in_1.GetAllPositionPermissionsByPositionIdsDtoIn([dtoIn.positionId]));
            const positionPermissions = positionPermissionsDtoOut.items.map((positionPermission) => ({
                ...positionPermission,
            }));
            return new list_permission_position_by_position_id_dto_out_1.ListPermissionPositionByPositionIdDtoOut(positionPermissions, positionPermissionsDtoOut.total);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ListPermissionPositionByPositionIdUseCase',
                error,
                appFile: __filename,
                context: {
                    positionId: dtoIn.positionId,
                    officeId: dtoIn.officeId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on list permission position by position id use case';
            throw new Error(message);
        }
    }
};
exports.ListPermissionPositionByPositionIdUseCase = ListPermissionPositionByPositionIdUseCase;
exports.ListPermissionPositionByPositionIdUseCase = ListPermissionPositionByPositionIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_position_by_unique_id_service_1.FindPositionByUniqueIdService,
        get_all_position_permissions_by_position_ids_service_1.GetAllPositionPermissionsByPositionIdsService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ListPermissionPositionByPositionIdUseCase);
//# sourceMappingURL=list-permission-position-by-position-id.use-case.js.map