import { RegisterPaymentCustomerRequest } from './http/register-payment-customer.request';
import { RegisterPaymentCustomerUseCase } from './register-payment-customer.use-case';
export declare class RegisterPaymentCustomerController {
    private readonly registerPaymentCustomerUseCase;
    constructor(registerPaymentCustomerUseCase: RegisterPaymentCustomerUseCase);
    handle(body: RegisterPaymentCustomerRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/register-payment-customer.dto-out").RegisterPaymentCustomerDtoOut;
    }>;
}
