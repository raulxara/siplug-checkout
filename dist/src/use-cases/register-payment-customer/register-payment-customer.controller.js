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
exports.RegisterPaymentCustomerController = void 0;
const common_1 = require("@nestjs/common");
const register_payment_customer_dto_in_1 = require("./dtos/register-payment-customer.dto-in");
const register_payment_customer_request_1 = require("./http/register-payment-customer.request");
const register_payment_customer_use_case_1 = require("./register-payment-customer.use-case");
let RegisterPaymentCustomerController = class RegisterPaymentCustomerController {
    registerPaymentCustomerUseCase;
    constructor(registerPaymentCustomerUseCase) {
        this.registerPaymentCustomerUseCase = registerPaymentCustomerUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.registerPaymentCustomerUseCase.exec(new register_payment_customer_dto_in_1.RegisterPaymentCustomerDtoIn({
                token,
                officeId: body.officeId,
                clientId: body.clientId,
                profileId: body.profileId ?? null,
                externalReference: body.externalReference ?? null,
                name: body.name,
                email: body.email ?? null,
                documentType: body.documentType ?? null,
                documentValue: body.documentValue ?? null,
                phone: body.phone ?? null,
                billingAddress: body.billingAddress ?? null,
                metadata: body.metadata ?? null,
                config: body.config ?? null,
                status: body.status ?? 'active',
            }));
            return {
                status: 'success',
                message: 'payment customer registered successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on register payment customer controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.RegisterPaymentCustomerController = RegisterPaymentCustomerController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_payment_customer_request_1.RegisterPaymentCustomerRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterPaymentCustomerController.prototype, "handle", null);
exports.RegisterPaymentCustomerController = RegisterPaymentCustomerController = __decorate([
    (0, common_1.Controller)('payment-customers'),
    __metadata("design:paramtypes", [register_payment_customer_use_case_1.RegisterPaymentCustomerUseCase])
], RegisterPaymentCustomerController);
//# sourceMappingURL=register-payment-customer.controller.js.map