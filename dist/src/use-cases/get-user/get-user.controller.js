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
exports.GetUserController = void 0;
const common_1 = require("@nestjs/common");
const get_user_dto_in_1 = require("./dtos/get-user.dto-in");
const get_user_request_1 = require("./http/get-user.request");
const get_user_use_case_1 = require("./get-user.use-case");
let GetUserController = class GetUserController {
    getUserUseCase;
    constructor(getUserUseCase) {
        this.getUserUseCase = getUserUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.getUserUseCase.exec(new get_user_dto_in_1.GetUserDtoIn({
                token,
                userCustomerId: body.userCustomerId,
            }));
            return {
                status: 'success',
                message: 'user found successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on get user controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.GetUserController = GetUserController;
__decorate([
    (0, common_1.Post)('get'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_request_1.GetUserRequest, String]),
    __metadata("design:returntype", Promise)
], GetUserController.prototype, "handle", null);
exports.GetUserController = GetUserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [get_user_use_case_1.GetUserUseCase])
], GetUserController);
//# sourceMappingURL=get-user.controller.js.map