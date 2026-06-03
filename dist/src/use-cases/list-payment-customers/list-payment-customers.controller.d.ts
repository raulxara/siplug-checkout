import { ListPaymentCustomersRequest } from './http/list-payment-customers.request';
import { ListPaymentCustomersUseCase } from './list-payment-customers.use-case';
export declare class ListPaymentCustomersController {
    private readonly listPaymentCustomersUseCase;
    constructor(listPaymentCustomersUseCase: ListPaymentCustomersUseCase);
    handle(body: ListPaymentCustomersRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/list-payment-customers.dto-out").ListPaymentCustomersDtoOut;
    }>;
}
