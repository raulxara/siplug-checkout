import { CreateGatewayCardTokenUseCase } from './create-gateway-card-token.use-case';
export declare class CreateGatewayCardTokenController {
    private readonly createGatewayCardTokenUseCase;
    constructor(createGatewayCardTokenUseCase: CreateGatewayCardTokenUseCase);
    create(body: unknown): Promise<{
        status: string;
        message: string;
        data: import("./dtos/create-gateway-card-token.dto-out").CreateGatewayCardTokenDtoOut;
    }>;
    private asRecord;
}
