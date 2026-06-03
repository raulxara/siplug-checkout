import type { SubscriptionPlanRow } from '../../../entities/subscription-plans-repository.interface';
export declare class FindSubscriptionPlanBySlugAndOfficeIdDtoOut {
    readonly subscriptionPlan: SubscriptionPlanRow | null;
    constructor(subscriptionPlan: SubscriptionPlanRow | null);
}
