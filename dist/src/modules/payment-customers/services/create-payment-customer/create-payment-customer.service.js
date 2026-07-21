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
exports.CreatePaymentCustomerService = void 0;
const common_1 = require("@nestjs/common");
const payment_customer_entity_1 = require("../../entities/payment-customer.entity");
const payment_customers_tokens_1 = require("../../tokens/payment-customers.tokens");
const create_payment_customer_dto_out_1 = require("./dtos/create-payment-customer.dto-out");
let CreatePaymentCustomerService = class CreatePaymentCustomerService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new payment_customer_entity_1.PaymentCustomerEntity(this.repository);
            entity.officeId = dtoIn.officeId;
            entity.clientId = dtoIn.clientId;
            entity.profileId = dtoIn.profileId;
            entity.externalReference = dtoIn.externalReference;
            entity.name = dtoIn.name;
            entity.email = dtoIn.email;
            entity.documentType = dtoIn.documentType;
            entity.documentValue = dtoIn.documentValue;
            entity.phone = dtoIn.phone;
            entity.billingAddress = dtoIn.billingAddress;
            entity.metadata = dtoIn.metadata;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            await entity.create();
            return create_payment_customer_dto_out_1.CreatePaymentCustomerDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create payment customer';
            throw new Error(message);
        }
    }
};
exports.CreatePaymentCustomerService = CreatePaymentCustomerService;
exports.CreatePaymentCustomerService = CreatePaymentCustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_customers_tokens_1.PAYMENT_CUSTOMERS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreatePaymentCustomerService);
//# sourceMappingURL=create-payment-customer.service.js.map