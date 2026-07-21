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
exports.GetPermissionByUniqueIdController = void 0;
const common_1 = require("@nestjs/common");
const get_permission_by_unique_id_dto_in_1 = require("./dtos/get-permission-by-unique-id.dto-in");
const get_permission_by_unique_id_use_case_1 = require("./get-permission-by-unique-id.use-case");
let GetPermissionByUniqueIdController = class GetPermissionByUniqueIdController {
    getPermissionByUniqueIdUseCase;
    constructor(getPermissionByUniqueIdUseCase) {
        this.getPermissionByUniqueIdUseCase = getPermissionByUniqueIdUseCase;
    }
    async handle(body) {
        const dtoOut = await this.getPermissionByUniqueIdUseCase.exec(new get_permission_by_unique_id_dto_in_1.GetPermissionByUniqueIdDtoIn({
            permissionId: body.permissionId,
            _id: body._id,
        }));
        return {
            status: 'success',
            message: 'permission found successfully',
            data: {
                permission: dtoOut.permission,
            },
        };
    }
};
exports.GetPermissionByUniqueIdController = GetPermissionByUniqueIdController;
__decorate([
    (0, common_1.Post)('get-by-unique-id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GetPermissionByUniqueIdController.prototype, "handle", null);
exports.GetPermissionByUniqueIdController = GetPermissionByUniqueIdController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [get_permission_by_unique_id_use_case_1.GetPermissionByUniqueIdUseCase])
], GetPermissionByUniqueIdController);
//# sourceMappingURL=get-permission-by-unique-id.controller.js.map