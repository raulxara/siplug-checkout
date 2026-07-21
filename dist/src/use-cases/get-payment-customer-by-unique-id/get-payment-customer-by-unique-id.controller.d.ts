import { GetPaymentCustomerByUniqueIdRequest } from './http/get-payment-customer-by-unique-id.request';
import { GetPaymentCustomerByUniqueIdUseCase } from './get-payment-customer-by-unique-id.use-case';
export declare class GetPaymentCustomerByUniqueIdController {
    private readonly getPaymentCustomerByUniqueIdUseCase;
    constructor(getPaymentCustomerByUniqueIdUseCase: GetPaymentCustomerByUniqueIdUseCase);
    handle(body: GetPaymentCustomerByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/get-payment-customer-by-unique-id.dto-out").GetPaymentCustomerByUniqueIdDtoOut;
    }>;
}
