import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { FindSubscriptionPlanBySlugAndOfficeIdDtoIn } from './dtos/find-subscription-plan-by-slug-and-office-id.dto-in';
import { FindSubscriptionPlanBySlugAndOfficeIdDtoOut } from './dtos/find-subscription-plan-by-slug-and-office-id.dto-out';
export declare class FindSubscriptionPlanBySlugAndOfficeIdService {
    private readonly repository;
    constructor(repository: ISubscriptionPlansRepository);
    exec(dtoIn: FindSubscriptionPlanBySlugAndOfficeIdDtoIn): Promise<FindSubscriptionPlanBySlugAndOfficeIdDtoOut>;
}
