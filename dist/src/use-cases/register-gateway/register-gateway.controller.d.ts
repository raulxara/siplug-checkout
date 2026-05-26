import { RegisterGatewayRequest } from './http/register-gateway.request';
import { RegisterGatewayUseCase } from './register-gateway.use-case';
export declare class RegisterGatewayController {
    private readonly registerGatewayUseCase;
    constructor(registerGatewayUseCase: RegisterGatewayUseCase);
    handle(body: RegisterGatewayRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/register-gateway.dto-out").RegisterGatewayDtoOut;
    }>;
}
