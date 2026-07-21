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
exports.GetAllSubscriptionsByOfficeIdService = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_tokens_1 = require("../../tokens/subscriptions.tokens");
const get_all_subscriptions_by_office_id_dto_out_1 = require("./dtos/get-all-subscriptions-by-office-id.dto-out");
let GetAllSubscriptionsByOfficeIdService = class GetAllSubscriptionsByOfficeIdService {
    subscriptionsRepository;
    constructor(subscriptionsRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
    }
    async exec(dtoIn) {
        const subscriptions = await this.subscriptionsRepository.getAllByOfficeId(dtoIn.officeId);
        return new get_all_subscriptions_by_office_id_dto_out_1.GetAllSubscriptionsByOfficeIdDtoOut(subscriptions);
    }
};
exports.GetAllSubscriptionsByOfficeIdService = GetAllSubscriptionsByOfficeIdService;
exports.GetAllSubscriptionsByOfficeIdService = GetAllSubscriptionsByOfficeIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscriptions_tokens_1.SUBSCRIPTIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetAllSubscriptionsByOfficeIdService);
//# sourceMappingURL=get-all-subscriptions-by-office-id.service.js.map