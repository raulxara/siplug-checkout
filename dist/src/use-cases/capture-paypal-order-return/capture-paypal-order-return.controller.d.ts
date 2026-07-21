import { CapturePayPalOrderReturnUseCase } from './capture-paypal-order-return.use-case';
export declare class CapturePayPalOrderReturnController {
    private readonly capturePayPalOrderReturnUseCase;
    constructor(capturePayPalOrderReturnUseCase: CapturePayPalOrderReturnUseCase);
    captureReturn(apiCredentialId: string, token: string): Promise<{
        status: string;
        message: string;
        data: {
            paymentWebhookEvent: Record<string, unknown>;
            paymentTransaction: Record<string, unknown> | null;
            processingResult: Record<string, unknown>;
            providerResponse: Record<string, unknown> | null;
            wasAlreadyRegistered: boolean;
        };
    }>;
    cancelReturn(apiCredentialId: string, token: string): Promise<{
        status: string;
        message: string;
        data: {
            paymentWebhookEvent: Record<string, unknown>;
            paymentTransaction: Record<string, unknown> | null;
            processingResult: Record<string, unknown>;
            wasAlreadyRegistered: boolean;
        };
    }>;
}
