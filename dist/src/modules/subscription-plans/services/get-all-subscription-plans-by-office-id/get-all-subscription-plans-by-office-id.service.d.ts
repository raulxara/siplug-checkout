import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { GetAllSubscriptionPlansByOfficeIdDtoIn } from './dtos/get-all-subscription-plans-by-office-id.dto-in';
import { GetAllSubscriptionPlansByOfficeIdDtoOut } from './dtos/get-all-subscription-plans-by-office-id.dto-out';
export declare class GetAllSubscriptionPlansByOfficeIdService {
    private readonly subscriptionPlansRepository;
    constructor(subscriptionPlansRepository: ISubscriptionPlansRepository);
    exec(dtoIn: GetAllSubscriptionPlansByOfficeIdDtoIn): Promise<GetAllSubscriptionPlansByOfficeIdDtoOut>;
}
