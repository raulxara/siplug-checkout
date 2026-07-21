import { GetPaymentCustomersByOfficeIdRequest } from './http/get-payment-customers-by-office-id.request';
import { GetPaymentCustomersByOfficeIdUseCase } from './get-payment-customers-by-office-id.use-case';
export declare class GetPaymentCustomersByOfficeIdController {
    private readonly getPaymentCustomersByOfficeIdUseCase;
    constructor(getPaymentCustomersByOfficeIdUseCase: GetPaymentCustomersByOfficeIdUseCase);
    handle(body: GetPaymentCustomersByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/get-payment-customers-by-office-id.dto-out").GetPaymentCustomersByOfficeIdDtoOut;
    }>;
}
