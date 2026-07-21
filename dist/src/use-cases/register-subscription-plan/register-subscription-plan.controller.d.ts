import { RegisterSubscriptionPlanRequest } from './http/register-subscription-plan.request';
import { RegisterSubscriptionPlanUseCase } from './register-subscription-plan.use-case';
export declare class RegisterSubscriptionPlanController {
    private readonly registerSubscriptionPlanUseCase;
    constructor(registerSubscriptionPlanUseCase: RegisterSubscriptionPlanUseCase);
    handle(authorization: string | undefined, body: RegisterSubscriptionPlanRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
