import { RegisterCheckoutSessionRequest } from './http/register-checkout-session.request';
import { RegisterCheckoutSessionUseCase } from './register-checkout-session.use-case';
export declare class RegisterCheckoutSessionController {
    private readonly registerCheckoutSessionUseCase;
    constructor(registerCheckoutSessionUseCase: RegisterCheckoutSessionUseCase);
    handle(body: RegisterCheckoutSessionRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/register-checkout-session.dto-out").RegisterCheckoutSessionDtoOut;
    }>;
}
