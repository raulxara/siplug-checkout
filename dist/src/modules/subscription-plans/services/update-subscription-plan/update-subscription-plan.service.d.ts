import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { UpdateSubscriptionPlanDtoIn } from './dtos/update-subscription-plan.dto-in';
import { UpdateSubscriptionPlanDtoOut } from './dtos/update-subscription-plan.dto-out';
export declare class UpdateSubscriptionPlanService {
    private readonly subscriptionPlansRepository;
    private readonly buildChangesHistoryService;
    constructor(subscriptionPlansRepository: ISubscriptionPlansRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateSubscriptionPlanDtoIn): Promise<UpdateSubscriptionPlanDtoOut>;
    private buildNewDataForHistory;
    private addIfNotNull;
}
