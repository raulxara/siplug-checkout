import { UpdateGatewayRequest } from './http/update-gateway.request';
import { UpdateGatewayUseCase } from './update-gateway.use-case';
export declare class UpdateGatewayController {
    private readonly updateGatewayUseCase;
    constructor(updateGatewayUseCase: UpdateGatewayUseCase);
    handle(body: UpdateGatewayRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/update-gateway.dto-out").UpdateGatewayDtoOut;
    }>;
}
