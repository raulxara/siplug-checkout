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
exports.RegisterUserController = void 0;
const common_1 = require("@nestjs/common");
const register_user_dto_in_1 = require("./dtos/register-user.dto-in");
const register_user_request_1 = require("./http/register-user.request");
const register_user_use_case_1 = require("./register-user.use-case");
let RegisterUserController = class RegisterUserController {
    registerUserUseCase;
    constructor(registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.registerUserUseCase.exec(new register_user_dto_in_1.RegisterUserDtoIn({
                token,
                officeId: body.officeId,
                positionSlug: body.positionSlug ?? 'customer',
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone ?? null,
                documentType: body.documentType ?? null,
                documentValue: body.documentValue ?? null,
                username: body.username,
                password: body.password,
                userType: body.userType ?? 'customer',
                twoFaRequired: body.twoFaRequired ?? false,
                twoFaChannels: body.twoFaChannels ?? [],
                profileConfig: body.profileConfig ?? null,
                clientConfig: body.clientConfig ?? null,
                userCustomerConfig: body.userCustomerConfig ?? null,
                status: body.status ?? 'active',
            }));
            return {
                status: 'success',
                message: 'user registered successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on register user controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.RegisterUserController = RegisterUserController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_request_1.RegisterUserRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterUserController.prototype, "handle", null);
exports.RegisterUserController = RegisterUserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [register_user_use_case_1.RegisterUserUseCase])
], RegisterUserController);
//# sourceMappingURL=register-user.controller.js.map