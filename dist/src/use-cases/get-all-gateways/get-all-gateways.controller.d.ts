import { GetAllGatewaysRequest } from './http/get-all-gateways.request';
import { GetAllGatewaysUseCase } from './get-all-gateways.use-case';
export declare class GetAllGatewaysController {
    private readonly getAllGatewaysUseCase;
    constructor(getAllGatewaysUseCase: GetAllGatewaysUseCase);
    handle(body: GetAllGatewaysRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/get-all-gateways.dto-out").GetAllGatewaysDtoOut;
    }>;
}
