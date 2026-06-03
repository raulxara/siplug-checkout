import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { FindSubscriptionPlanByUniqueIdDtoIn } from './dtos/find-subscription-plan-by-unique-id.dto-in';
import { FindSubscriptionPlanByUniqueIdDtoOut } from './dtos/find-subscription-plan-by-unique-id.dto-out';
export declare class FindSubscriptionPlanByUniqueIdService {
    private readonly repository;
    constructor(repository: ISubscriptionPlansRepository);
    exec(dtoIn: FindSubscriptionPlanByUniqueIdDtoIn): Promise<FindSubscriptionPlanByUniqueIdDtoOut>;
}
