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
exports.GetPaymentCustomersByOfficeIdController = void 0;
const common_1 = require("@nestjs/common");
const get_payment_customers_by_office_id_dto_in_1 = require("./dtos/get-payment-customers-by-office-id.dto-in");
const get_payment_customers_by_office_id_request_1 = require("./http/get-payment-customers-by-office-id.request");
const get_payment_customers_by_office_id_use_case_1 = require("./get-payment-customers-by-office-id.use-case");
let GetPaymentCustomersByOfficeIdController = class GetPaymentCustomersByOfficeIdController {
    getPaymentCustomersByOfficeIdUseCase;
    constructor(getPaymentCustomersByOfficeIdUseCase) {
        this.getPaymentCustomersByOfficeIdUseCase = getPaymentCustomersByOfficeIdUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.getPaymentCustomersByOfficeIdUseCase.exec(new get_payment_customers_by_office_id_dto_in_1.GetPaymentCustomersByOfficeIdDtoIn({
                token,
                officeId: body.officeId,
            }));
            return {
                status: 'success',
                message: 'payment customers listed successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on get payment customers by office id controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.GetPaymentCustomersByOfficeIdController = GetPaymentCustomersByOfficeIdController;
__decorate([
    (0, common_1.Post)('get-by-office-id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_payment_customers_by_office_id_request_1.GetPaymentCustomersByOfficeIdRequest, String]),
    __metadata("design:returntype", Promise)
], GetPaymentCustomersByOfficeIdController.prototype, "handle", null);
exports.GetPaymentCustomersByOfficeIdController = GetPaymentCustomersByOfficeIdController = __decorate([
    (0, common_1.Controller)('payment-customers'),
    __metadata("design:paramtypes", [get_payment_customers_by_office_id_use_case_1.GetPaymentCustomersByOfficeIdUseCase])
], GetPaymentCustomersByOfficeIdController);
//# sourceMappingURL=get-payment-customers-by-office-id.controller.js.map