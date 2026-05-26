import { UpdatePaymentCustomerRequest } from './http/update-payment-customer.request';
import { UpdatePaymentCustomerUseCase } from './update-payment-customer.use-case';
export declare class UpdatePaymentCustomerController {
    private readonly updatePaymentCustomerUseCase;
    constructor(updatePaymentCustomerUseCase: UpdatePaymentCustomerUseCase);
    handle(body: UpdatePaymentCustomerRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/update-payment-customer.dto-out").UpdatePaymentCustomerDtoOut;
    }>;
}
