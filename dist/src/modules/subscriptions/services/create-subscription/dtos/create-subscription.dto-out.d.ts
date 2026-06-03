import type { SubscriptionRow } from '../../../entities/subscriptions-repository.interface';
export declare class CreateSubscriptionDtoOut {
    readonly subscription: SubscriptionRow;
    constructor(subscription: SubscriptionRow);
}
