import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { CreateSubscriptionDtoIn } from './dtos/create-subscription.dto-in';
import { CreateSubscriptionDtoOut } from './dtos/create-subscription.dto-out';
export declare class CreateSubscriptionService {
    private readonly repository;
    constructor(repository: ISubscriptionsRepository);
    exec(dtoIn: CreateSubscriptionDtoIn): Promise<CreateSubscriptionDtoOut>;
    private toRow;
    private requiredNumber;
    private requiredString;
}
