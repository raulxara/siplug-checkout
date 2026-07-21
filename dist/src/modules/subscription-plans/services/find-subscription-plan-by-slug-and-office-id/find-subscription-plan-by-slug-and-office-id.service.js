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
exports.FindSubscriptionPlanBySlugAndOfficeIdService = void 0;
const common_1 = require("@nestjs/common");
const subscription_plans_tokens_1 = require("../../tokens/subscription-plans.tokens");
const find_subscription_plan_by_slug_and_office_id_dto_out_1 = require("./dtos/find-subscription-plan-by-slug-and-office-id.dto-out");
let FindSubscriptionPlanBySlugAndOfficeIdService = class FindSubscriptionPlanBySlugAndOfficeIdService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const row = await this.repository.findBySlugAndOfficeId({
                slug: dtoIn.slug,
                officeId: dtoIn.officeId,
            });
            return new find_subscription_plan_by_slug_and_office_id_dto_out_1.FindSubscriptionPlanBySlugAndOfficeIdDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on find subscription plan by slug and office id';
            throw new Error(message);
        }
    }
};
exports.FindSubscriptionPlanBySlugAndOfficeIdService = FindSubscriptionPlanBySlugAndOfficeIdService;
exports.FindSubscriptionPlanBySlugAndOfficeIdService = FindSubscriptionPlanBySlugAndOfficeIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscription_plans_tokens_1.SUBSCRIPTION_PLANS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindSubscriptionPlanBySlugAndOfficeIdService);
//# sourceMappingURL=find-subscription-plan-by-slug-and-office-id.service.js.map