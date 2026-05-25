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
exports.GetAllUserCustomersByClientIdsService = void 0;
const common_1 = require("@nestjs/common");
const user_customers_tokens_1 = require("../../tokens/user-customers.tokens");
const get_all_user_customers_by_client_ids_dto_out_1 = require("./dtos/get-all-user-customers-by-client-ids.dto-out");
let GetAllUserCustomersByClientIdsService = class GetAllUserCustomersByClientIdsService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const rows = await this.repository.getAllByClientIds(dtoIn.clientIds);
            return new get_all_user_customers_by_client_ids_dto_out_1.GetAllUserCustomersByClientIdsDtoOut(rows, rows.length);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on get all user customers by client ids';
            throw new Error(message);
        }
    }
};
exports.GetAllUserCustomersByClientIdsService = GetAllUserCustomersByClientIdsService;
exports.GetAllUserCustomersByClientIdsService = GetAllUserCustomersByClientIdsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_customers_tokens_1.USER_CUSTOMERS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetAllUserCustomersByClientIdsService);
//# sourceMappingURL=get-all-user-customers-by-client-ids.service.js.map