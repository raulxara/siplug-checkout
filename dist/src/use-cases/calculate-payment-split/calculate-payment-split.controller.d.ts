import { CalculatePaymentSplitRequest } from './http/calculate-payment-split.request';
import { CalculatePaymentSplitUseCase } from './calculate-payment-split.use-case';
export declare class CalculatePaymentSplitController {
    private readonly calculatePaymentSplitUseCase;
    constructor(calculatePaymentSplitUseCase: CalculatePaymentSplitUseCase);
    handle(request: CalculatePaymentSplitRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            paymentSplitCalculation: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
