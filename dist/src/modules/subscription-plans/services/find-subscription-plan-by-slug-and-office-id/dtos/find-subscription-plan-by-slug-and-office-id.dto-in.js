"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSubscriptionPlanBySlugAndOfficeIdDtoIn = void 0;
class FindSubscriptionPlanBySlugAndOfficeIdDtoIn {
    slug;
    officeId;
    constructor(params) {
        if (!params.slug || params.slug.trim() === '') {
            throw new Error('slug is required');
        }
        if (!params.officeId || params.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        this.slug = params.slug.trim();
        this.officeId = params.officeId.trim();
    }
}
exports.FindSubscriptionPlanBySlugAndOfficeIdDtoIn = FindSubscriptionPlanBySlugAndOfficeIdDtoIn;
//# sourceMappingURL=find-subscription-plan-by-slug-and-office-id.dto-in.js.map