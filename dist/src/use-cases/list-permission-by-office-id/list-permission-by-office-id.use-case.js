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
exports.ListPermissionByOfficeIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const list_permissions_by_office_id_dto_in_1 = require("../../modules/permissions/services/list-permissions-by-office-id/dtos/list-permissions-by-office-id.dto-in");
const list_permissions_by_office_id_service_1 = require("../../modules/permissions/services/list-permissions-by-office-id/list-permissions-by-office-id.service");
const list_permission_by_office_id_dto_out_1 = require("./dtos/list-permission-by-office-id.dto-out");
let ListPermissionByOfficeIdUseCase = class ListPermissionByOfficeIdUseCase {
    listPermissionsByOfficeIdService;
    handleUseCaseExceptionService;
    constructor(listPermissionsByOfficeIdService, handleUseCaseExceptionService) {
        this.listPermissionsByOfficeIdService = listPermissionsByOfficeIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const dtoOut = await this.listPermissionsByOfficeIdService.exec(new list_permissions_by_office_id_dto_in_1.ListPermissionsByOfficeIdDtoIn({
                officeId: dtoIn.officeId,
            }));
            return new list_permission_by_office_id_dto_out_1.ListPermissionByOfficeIdDtoOut(dtoOut.permissions.map((permission) => ({
                ...permission,
            })), dtoOut.permissions.length);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ListPermissionByOfficeIdUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on list permission by office id use case';
            throw new Error(message);
        }
    }
};
exports.ListPermissionByOfficeIdUseCase = ListPermissionByOfficeIdUseCase;
exports.ListPermissionByOfficeIdUseCase = ListPermissionByOfficeIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [list_permissions_by_office_id_service_1.ListPermissionsByOfficeIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ListPermissionByOfficeIdUseCase);
//# sourceMappingURL=list-permission-by-office-id.use-case.js.map