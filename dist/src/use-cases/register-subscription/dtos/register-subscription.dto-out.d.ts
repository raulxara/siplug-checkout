import type { SubscriptionRow } from '../../../modules/subscriptions/entities/subscriptions-repository.interface';
export declare class RegisterSubscriptionDtoOut {
    readonly subscription: SubscriptionRow;
    constructor(subscription: SubscriptionRow);
}
