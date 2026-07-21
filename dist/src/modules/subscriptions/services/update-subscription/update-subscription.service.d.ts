import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { UpdateSubscriptionDtoIn } from './dtos/update-subscription.dto-in';
import { UpdateSubscriptionDtoOut } from './dtos/update-subscription.dto-out';
export declare class UpdateSubscriptionService {
    private readonly repository;
    constructor(repository: ISubscriptionsRepository);
    exec(dtoIn: UpdateSubscriptionDtoIn): Promise<UpdateSubscriptionDtoOut>;
    private buildChangesHistory;
    private appendChange;
}
