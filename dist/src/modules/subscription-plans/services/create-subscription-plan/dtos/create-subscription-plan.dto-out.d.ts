import type { SubscriptionPlanRow } from '../../../entities/subscription-plans-repository.interface';
export declare class CreateSubscriptionPlanDtoOut {
    readonly subscriptionPlan: SubscriptionPlanRow;
    constructor(subscriptionPlan: SubscriptionPlanRow);
}
