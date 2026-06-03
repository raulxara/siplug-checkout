import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { FindSubscriptionByUniqueIdDtoIn } from './dtos/find-subscription-by-unique-id.dto-in';
import { FindSubscriptionByUniqueIdDtoOut } from './dtos/find-subscription-by-unique-id.dto-out';
export declare class FindSubscriptionByUniqueIdService {
    private readonly repository;
    constructor(repository: ISubscriptionsRepository);
    exec(dtoIn: FindSubscriptionByUniqueIdDtoIn): Promise<FindSubscriptionByUniqueIdDtoOut>;
}
