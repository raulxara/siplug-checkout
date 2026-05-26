import { ProcessPaymentRequest } from './http/process-payment.request';
import { ProcessPaymentUseCase } from './process-payment.use-case';
export declare class ProcessPaymentController {
    private readonly processPaymentUseCase;
    constructor(processPaymentUseCase: ProcessPaymentUseCase);
    handle(body: ProcessPaymentRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/process-payment.dto-out").ProcessPaymentDtoOut;
    }>;
}
