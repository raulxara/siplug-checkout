import { RegisterPaymentSplitRequest } from './http/register-payment-split.request';
import { RegisterPaymentSplitUseCase } from './register-payment-split.use-case';
export declare class RegisterPaymentSplitController {
    private readonly registerPaymentSplitUseCase;
    constructor(registerPaymentSplitUseCase: RegisterPaymentSplitUseCase);
    handle(request: RegisterPaymentSplitRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            paymentSplit: Record<string, unknown>;
            paymentSplitRecipients: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
