import { UpdateCheckoutSessionRequest } from './http/update-checkout-session.request';
import { UpdateCheckoutSessionUseCase } from './update-checkout-session.use-case';
export declare class UpdateCheckoutSessionController {
    private readonly updateCheckoutSessionUseCase;
    constructor(updateCheckoutSessionUseCase: UpdateCheckoutSessionUseCase);
    handle(body: UpdateCheckoutSessionRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/update-checkout-session.dto-out").UpdateCheckoutSessionDtoOut;
    }>;
}
