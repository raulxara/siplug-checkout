import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { GetAllSubscriptionPlansDtoOut } from './dtos/get-all-subscription-plans.dto-out';
export declare class GetAllSubscriptionPlansService {
    private readonly subscriptionPlansRepository;
    constructor(subscriptionPlansRepository: ISubscriptionPlansRepository);
    exec(): Promise<GetAllSubscriptionPlansDtoOut>;
}
