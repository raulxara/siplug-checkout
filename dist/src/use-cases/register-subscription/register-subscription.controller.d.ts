import { RegisterSubscriptionRequest } from './http/register-subscription.request';
import { RegisterSubscriptionUseCase } from './register-subscription.use-case';
export declare class RegisterSubscriptionController {
    private readonly registerSubscriptionUseCase;
    constructor(registerSubscriptionUseCase: RegisterSubscriptionUseCase);
    handle(authorization: string | undefined, body: RegisterSubscriptionRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
