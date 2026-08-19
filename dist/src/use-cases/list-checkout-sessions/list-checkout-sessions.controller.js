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
exports.ListCheckoutSessionsController = void 0;
const common_1 = require("@nestjs/common");
const list_checkout_sessions_dto_in_1 = require("./dtos/list-checkout-sessions.dto-in");
const list_checkout_sessions_request_1 = require("./http/list-checkout-sessions.request");
const list_checkout_sessions_use_case_1 = require("./list-checkout-sessions.use-case");
let ListCheckoutSessionsController = class ListCheckoutSessionsController {
    listCheckoutSessionsUseCase;
    constructor(listCheckoutSessionsUseCase) {
        this.listCheckoutSessionsUseCase = listCheckoutSessionsUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';
            const dtoOut = await this.listCheckoutSessionsUseCase.exec(new list_checkout_sessions_dto_in_1.ListCheckoutSessionsDtoIn({
                token,
                officeId: body.officeId,
                status: body.status ?? null,
                search: body.search ?? null,
                page: body.page ?? 1,
                perPage: body.perPage ?? 20,
            }));
            return {
                status: 'success',
                message: 'checkout sessions listed successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on list checkout sessions controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.ListCheckoutSessionsController = ListCheckoutSessionsController;
__decorate([
    (0, common_1.Post)('list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_checkout_sessions_request_1.ListCheckoutSessionsRequest, String]),
    __metadata("design:returntype", Promise)
], ListCheckoutSessionsController.prototype, "handle", null);
exports.ListCheckoutSessionsController = ListCheckoutSessionsController = __decorate([
    (0, common_1.Controller)('checkout-sessions'),
    __metadata("design:paramtypes", [list_checkout_sessions_use_case_1.ListCheckoutSessionsUseCase])
], ListCheckoutSessionsController);
//# sourceMappingURL=list-checkout-sessions.controller.js.map