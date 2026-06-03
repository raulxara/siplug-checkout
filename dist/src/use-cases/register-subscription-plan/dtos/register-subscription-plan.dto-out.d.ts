import type { SubscriptionPlanRow } from '../../../modules/subscription-plans/entities/subscription-plans-repository.interface';
export declare class RegisterSubscriptionPlanDtoOut {
    readonly subscriptionPlan: SubscriptionPlanRow;
    constructor(subscriptionPlan: SubscriptionPlanRow);
}
