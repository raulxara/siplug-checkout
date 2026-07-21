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
exports.ListUsersController = void 0;
const common_1 = require("@nestjs/common");
const list_users_dto_in_1 = require("./dtos/list-users.dto-in");
const list_users_request_1 = require("./http/list-users.request");
const list_users_use_case_1 = require("./list-users.use-case");
let ListUsersController = class ListUsersController {
    listUsersUseCase;
    constructor(listUsersUseCase) {
        this.listUsersUseCase = listUsersUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.listUsersUseCase.exec(new list_users_dto_in_1.ListUsersDtoIn({
                token,
                officeId: body.officeId ?? null,
                status: body.status ?? null,
                search: body.search ?? null,
                page: body.page ?? 1,
                perPage: body.perPage ?? 20,
            }));
            return {
                status: 'success',
                message: 'users listed successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on list users controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.ListUsersController = ListUsersController;
__decorate([
    (0, common_1.Post)('list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_users_request_1.ListUsersRequest, String]),
    __metadata("design:returntype", Promise)
], ListUsersController.prototype, "handle", null);
exports.ListUsersController = ListUsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [list_users_use_case_1.ListUsersUseCase])
], ListUsersController);
//# sourceMappingURL=list-users.controller.js.map