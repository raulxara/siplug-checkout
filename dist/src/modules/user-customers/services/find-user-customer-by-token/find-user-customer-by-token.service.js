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
exports.FindUserCustomerByTokenService = void 0;
const common_1 = require("@nestjs/common");
const user_customers_tokens_1 = require("../../tokens/user-customers.tokens");
const find_user_customer_by_token_dto_out_1 = require("./dtos/find-user-customer-by-token.dto-out");
let FindUserCustomerByTokenService = class FindUserCustomerByTokenService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const userCustomer = await this.repository.findByToken(dtoIn.token);
            if (!userCustomer) {
                throw new Error('user customer not found');
            }
            return new find_user_customer_by_token_dto_out_1.FindUserCustomerByTokenDtoOut(userCustomer);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on find user customer by token';
            throw new Error(message);
        }
    }
};
exports.FindUserCustomerByTokenService = FindUserCustomerByTokenService;
exports.FindUserCustomerByTokenService = FindUserCustomerByTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_customers_tokens_1.USER_CUSTOMERS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindUserCustomerByTokenService);
//# sourceMappingURL=find-user-customer-by-token.service.js.map