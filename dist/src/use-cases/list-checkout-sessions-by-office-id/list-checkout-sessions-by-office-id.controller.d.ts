import { ListCheckoutSessionsByOfficeIdRequest } from './http/list-checkout-sessions-by-office-id.request';
import { ListCheckoutSessionsByOfficeIdUseCase } from './list-checkout-sessions-by-office-id.use-case';
export declare class ListCheckoutSessionsByOfficeIdController {
    private readonly listCheckoutSessionsByOfficeIdUseCase;
    constructor(listCheckoutSessionsByOfficeIdUseCase: ListCheckoutSessionsByOfficeIdUseCase);
    handle(body: ListCheckoutSessionsByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/list-checkout-sessions-by-office-id.dto-out").ListCheckoutSessionsByOfficeIdDtoOut;
    }>;
}
