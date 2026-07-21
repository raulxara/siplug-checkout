import type { SubscriptionRow } from '../../../entities/subscriptions-repository.interface';
export declare class FindSubscriptionByExternalReferenceAndOfficeIdDtoOut {
    readonly subscription: SubscriptionRow | null;
    constructor(subscription: SubscriptionRow | null);
}
