import { DispatchPaymentTransactionToGatewayRequest } from './http/dispatch-payment-transaction-to-gateway.request';
import { DispatchPaymentTransactionToGatewayUseCase } from './dispatch-payment-transaction-to-gateway.use-case';
export declare class DispatchPaymentTransactionToGatewayController {
    private readonly dispatchPaymentTransactionToGatewayUseCase;
    constructor(dispatchPaymentTransactionToGatewayUseCase: DispatchPaymentTransactionToGatewayUseCase);
    handle(body: DispatchPaymentTransactionToGatewayRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/dispatch-payment-transaction-to-gateway.dto-out").DispatchPaymentTransactionToGatewayDtoOut;
    }>;
}
