import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { GetAllSubscriptionsDtoOut } from './dtos/get-all-subscriptions.dto-out';
export declare class GetAllSubscriptionsService {
    private readonly subscriptionsRepository;
    constructor(subscriptionsRepository: ISubscriptionsRepository);
    exec(): Promise<GetAllSubscriptionsDtoOut>;
}
