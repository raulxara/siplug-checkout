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
exports.UpdateUserController = void 0;
const common_1 = require("@nestjs/common");
const update_user_dto_in_1 = require("./dtos/update-user.dto-in");
const update_user_request_1 = require("./http/update-user.request");
const update_user_use_case_1 = require("./update-user.use-case");
let UpdateUserController = class UpdateUserController {
    updateUserUseCase;
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.updateUserUseCase.exec(new update_user_dto_in_1.UpdateUserDtoIn({
                token,
                userCustomerId: body.userCustomerId,
                officeId: body.officeId ?? null,
                positionSlug: body.positionSlug ?? null,
                firstName: body.firstName ?? null,
                lastName: body.lastName ?? null,
                email: body.email ?? null,
                phone: body.phone ?? null,
                documentType: body.documentType ?? null,
                documentValue: body.documentValue ?? null,
                username: body.username ?? null,
                password: body.password ?? null,
                userType: body.userType ?? null,
                twoFaRequired: body.twoFaRequired ?? null,
                twoFaActive: body.twoFaActive ?? null,
                profileConfig: body.profileConfig ?? null,
                clientConfig: body.clientConfig ?? null,
                userCustomerConfig: body.userCustomerConfig ?? null,
                status: body.status ?? null,
                source: body.source ?? 'UpdateUserController',
            }));
            return {
                status: 'success',
                message: 'user updated successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update user controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.UpdateUserController = UpdateUserController;
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_request_1.UpdateUserRequest, String]),
    __metadata("design:returntype", Promise)
], UpdateUserController.prototype, "handle", null);
exports.UpdateUserController = UpdateUserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [update_user_use_case_1.UpdateUserUseCase])
], UpdateUserController);
//# sourceMappingURL=update-user.controller.js.map