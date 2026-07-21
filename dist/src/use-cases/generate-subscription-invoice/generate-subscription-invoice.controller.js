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
exports.GenerateSubscriptionInvoiceController = void 0;
const common_1 = require("@nestjs/common");
const generate_subscription_invoice_dto_in_1 = require("./dtos/generate-subscription-invoice.dto-in");
const generate_subscription_invoice_request_1 = require("./http/generate-subscription-invoice.request");
const generate_subscription_invoice_use_case_1 = require("./generate-subscription-invoice.use-case");
let GenerateSubscriptionInvoiceController = class GenerateSubscriptionInvoiceController {
    generateSubscriptionInvoiceUseCase;
    constructor(generateSubscriptionInvoiceUseCase) {
        this.generateSubscriptionInvoiceUseCase = generateSubscriptionInvoiceUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.generateSubscriptionInvoiceUseCase.exec(new generate_subscription_invoice_dto_in_1.GenerateSubscriptionInvoiceDtoIn({
                token: this.extractBearerToken(authorization),
                subscriptionId: body.subscriptionId,
                scheduledAt: body.scheduledAt ?? null,
                dueAt: body.dueAt ?? null,
                force: body.force ?? false,
            }));
            return {
                status: 'success',
                message: 'subscription invoice generated successfully',
                data: {
                    subscription: dtoOut.subscription,
                    subscriptionCycle: dtoOut.subscriptionCycle,
                    subscriptionInvoice: dtoOut.subscriptionInvoice,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on generate subscription invoice';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
    extractBearerToken(authorization) {
        if (!authorization || authorization.trim() === '') {
            throw new Error('authorization header is required');
        }
        return authorization.replace(/^Bearer\s+/i, '').trim();
    }
};
exports.GenerateSubscriptionInvoiceController = GenerateSubscriptionInvoiceController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, generate_subscription_invoice_request_1.GenerateSubscriptionInvoiceRequest]),
    __metadata("design:returntype", Promise)
], GenerateSubscriptionInvoiceController.prototype, "handle", null);
exports.GenerateSubscriptionInvoiceController = GenerateSubscriptionInvoiceController = __decorate([
    (0, common_1.Controller)('subscription-invoices'),
    __metadata("design:paramtypes", [generate_subscription_invoice_use_case_1.GenerateSubscriptionInvoiceUseCase])
], GenerateSubscriptionInvoiceController);
//# sourceMappingURL=generate-subscription-invoice.controller.js.map