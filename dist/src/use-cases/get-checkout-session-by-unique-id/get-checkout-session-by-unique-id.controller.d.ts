import { GetCheckoutSessionByUniqueIdRequest } from './http/get-checkout-session-by-unique-id.request';
import { GetCheckoutSessionByUniqueIdUseCase } from './get-checkout-session-by-unique-id.use-case';
export declare class GetCheckoutSessionByUniqueIdController {
    private readonly getCheckoutSessionByUniqueIdUseCase;
    constructor(getCheckoutSessionByUniqueIdUseCase: GetCheckoutSessionByUniqueIdUseCase);
    handle(body: GetCheckoutSessionByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/get-checkout-session-by-unique-id.dto-out").GetCheckoutSessionByUniqueIdDtoOut;
    }>;
}
