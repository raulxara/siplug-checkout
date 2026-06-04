import { ProcessRecurringPaymentRequest } from './http/process-recurring-payment.request';
import { ProcessRecurringPaymentUseCase } from './process-recurring-payment.use-case';
export declare class ProcessRecurringPaymentController {
    private readonly processRecurringPaymentUseCase;
    constructor(processRecurringPaymentUseCase: ProcessRecurringPaymentUseCase);
    handle(authorization: string | undefined, body: ProcessRecurringPaymentRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
