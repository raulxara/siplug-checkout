import { UpdateSubscriptionPlanRequest } from './http/update-subscription-plan.request';
import { UpdateSubscriptionPlanUseCase } from './update-subscription-plan.use-case';
export declare class UpdateSubscriptionPlanController {
    private readonly updateSubscriptionPlanUseCase;
    constructor(updateSubscriptionPlanUseCase: UpdateSubscriptionPlanUseCase);
    handle(request: UpdateSubscriptionPlanRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionPlan: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
