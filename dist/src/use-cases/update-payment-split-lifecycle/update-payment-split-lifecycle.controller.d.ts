import { UpdatePaymentSplitLifecycleRequest } from './http/update-payment-split-lifecycle.request';
import { UpdatePaymentSplitLifecycleUseCase } from './update-payment-split-lifecycle.use-case';
export declare class UpdatePaymentSplitLifecycleController {
    private readonly updatePaymentSplitLifecycleUseCase;
    constructor(updatePaymentSplitLifecycleUseCase: UpdatePaymentSplitLifecycleUseCase);
    handle(request: UpdatePaymentSplitLifecycleRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            paymentSplit: Record<string, unknown>;
            paymentSplitRecipients: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
