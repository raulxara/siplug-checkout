import type { SubscriptionPlanRow } from '../../../entities/subscription-plans-repository.interface';
export declare class FindSubscriptionPlanByUniqueIdDtoOut {
    readonly subscriptionPlan: SubscriptionPlanRow;
    constructor(subscriptionPlan: SubscriptionPlanRow);
}
