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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPermissionByOfficeIdController = void 0;
const common_1 = require("@nestjs/common");
const list_permission_by_office_id_dto_in_1 = require("./dtos/list-permission-by-office-id.dto-in");
const list_permission_by_office_id_use_case_1 = require("./list-permission-by-office-id.use-case");
let ListPermissionByOfficeIdController = class ListPermissionByOfficeIdController {
    listPermissionByOfficeIdUseCase;
    constructor(listPermissionByOfficeIdUseCase) {
        this.listPermissionByOfficeIdUseCase = listPermissionByOfficeIdUseCase;
    }
    async handle(body) {
        const dtoOut = await this.listPermissionByOfficeIdUseCase.exec(new list_permission_by_office_id_dto_in_1.ListPermissionByOfficeIdDtoIn({
            officeId: body.officeId,
        }));
        return {
            status: 'success',
            message: 'permissions listed successfully',
            data: {
                permissions: dtoOut.permissions,
                total: dtoOut.total,
            },
        };
    }
};
exports.ListPermissionByOfficeIdController = ListPermissionByOfficeIdController;
__decorate([
    (0, common_1.Post)('list-by-office-id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListPermissionByOfficeIdController.prototype, "handle", null);
exports.ListPermissionByOfficeIdController = ListPermissionByOfficeIdController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [list_permission_by_office_id_use_case_1.ListPermissionByOfficeIdUseCase])
], ListPermissionByOfficeIdController);
//# sourceMappingURL=list-permission-by-office-id.controller.js.map