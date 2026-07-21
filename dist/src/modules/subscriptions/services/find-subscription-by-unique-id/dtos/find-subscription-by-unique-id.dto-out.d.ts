import type { SubscriptionRow } from '../../../entities/subscriptions-repository.interface';
export declare class FindSubscriptionByUniqueIdDtoOut {
    readonly subscription: SubscriptionRow;
    constructor(subscription: SubscriptionRow);
}
