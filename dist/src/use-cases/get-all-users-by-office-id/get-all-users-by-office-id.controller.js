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
exports.GetAllUsersByOfficeIdController = void 0;
const common_1 = require("@nestjs/common");
const get_all_users_by_office_id_dto_in_1 = require("./dtos/get-all-users-by-office-id.dto-in");
const get_all_users_by_office_id_request_1 = require("./http/get-all-users-by-office-id.request");
const get_all_users_by_office_id_use_case_1 = require("./get-all-users-by-office-id.use-case");
let GetAllUsersByOfficeIdController = class GetAllUsersByOfficeIdController {
    getAllUsersByOfficeIdUseCase;
    constructor(getAllUsersByOfficeIdUseCase) {
        this.getAllUsersByOfficeIdUseCase = getAllUsersByOfficeIdUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.getAllUsersByOfficeIdUseCase.exec(new get_all_users_by_office_id_dto_in_1.GetAllUsersByOfficeIdDtoIn({
                token,
                officeId: body.officeId,
                status: body.status ?? null,
                search: body.search ?? null,
                page: body.page ?? 1,
                perPage: body.perPage ?? 20,
            }));
            return {
                status: 'success',
                message: 'office users listed successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on get all users by office id controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.GetAllUsersByOfficeIdController = GetAllUsersByOfficeIdController;
__decorate([
    (0, common_1.Post)('get-all-by-office-id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_users_by_office_id_request_1.GetAllUsersByOfficeIdRequest, String]),
    __metadata("design:returntype", Promise)
], GetAllUsersByOfficeIdController.prototype, "handle", null);
exports.GetAllUsersByOfficeIdController = GetAllUsersByOfficeIdController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [get_all_users_by_office_id_use_case_1.GetAllUsersByOfficeIdUseCase])
], GetAllUsersByOfficeIdController);
//# sourceMappingURL=get-all-users-by-office-id.controller.js.map