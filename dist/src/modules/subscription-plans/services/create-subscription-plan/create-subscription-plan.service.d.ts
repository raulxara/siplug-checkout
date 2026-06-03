import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { CreateSubscriptionPlanDtoIn } from './dtos/create-subscription-plan.dto-in';
import { CreateSubscriptionPlanDtoOut } from './dtos/create-subscription-plan.dto-out';
export declare class CreateSubscriptionPlanService {
    private readonly repository;
    constructor(repository: ISubscriptionPlansRepository);
    exec(dtoIn: CreateSubscriptionPlanDtoIn): Promise<CreateSubscriptionPlanDtoOut>;
    private toRow;
    private requiredNumber;
    private requiredString;
}
