import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { GetAllSubscriptionsByOfficeIdDtoIn } from './dtos/get-all-subscriptions-by-office-id.dto-in';
import { GetAllSubscriptionsByOfficeIdDtoOut } from './dtos/get-all-subscriptions-by-office-id.dto-out';
export declare class GetAllSubscriptionsByOfficeIdService {
    private readonly subscriptionsRepository;
    constructor(subscriptionsRepository: ISubscriptionsRepository);
    exec(dtoIn: GetAllSubscriptionsByOfficeIdDtoIn): Promise<GetAllSubscriptionsByOfficeIdDtoOut>;
}
