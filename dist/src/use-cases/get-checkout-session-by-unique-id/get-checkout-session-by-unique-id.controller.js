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
exports.GetCheckoutSessionByUniqueIdController = void 0;
const common_1 = require("@nestjs/common");
const get_checkout_session_by_unique_id_dto_in_1 = require("./dtos/get-checkout-session-by-unique-id.dto-in");
const get_checkout_session_by_unique_id_request_1 = require("./http/get-checkout-session-by-unique-id.request");
const get_checkout_session_by_unique_id_use_case_1 = require("./get-checkout-session-by-unique-id.use-case");
let GetCheckoutSessionByUniqueIdController = class GetCheckoutSessionByUniqueIdController {
    getCheckoutSessionByUniqueIdUseCase;
    constructor(getCheckoutSessionByUniqueIdUseCase) {
        this.getCheckoutSessionByUniqueIdUseCase = getCheckoutSessionByUniqueIdUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';
            const dtoOut = await this.getCheckoutSessionByUniqueIdUseCase.exec(new get_checkout_session_by_unique_id_dto_in_1.GetCheckoutSessionByUniqueIdDtoIn({
                token,
                checkoutSessionId: body.checkoutSessionId,
            }));
            return {
                status: 'success',
                message: 'checkout session found successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on get checkout session by unique id controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.GetCheckoutSessionByUniqueIdController = GetCheckoutSessionByUniqueIdController;
__decorate([
    (0, common_1.Post)('get-by-unique-id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_checkout_session_by_unique_id_request_1.GetCheckoutSessionByUniqueIdRequest, String]),
    __metadata("design:returntype", Promise)
], GetCheckoutSessionByUniqueIdController.prototype, "handle", null);
exports.GetCheckoutSessionByUniqueIdController = GetCheckoutSessionByUniqueIdController = __decorate([
    (0, common_1.Controller)('checkout-sessions'),
    __metadata("design:paramtypes", [get_checkout_session_by_unique_id_use_case_1.GetCheckoutSessionByUniqueIdUseCase])
], GetCheckoutSessionByUniqueIdController);
//# sourceMappingURL=get-checkout-session-by-unique-id.controller.js.map