import { GetAllUsersByOfficeIdRequest } from './http/get-all-users-by-office-id.request';
import { GetAllUsersByOfficeIdUseCase } from './get-all-users-by-office-id.use-case';
export declare class GetAllUsersByOfficeIdController {
    private readonly getAllUsersByOfficeIdUseCase;
    constructor(getAllUsersByOfficeIdUseCase: GetAllUsersByOfficeIdUseCase);
    handle(body: GetAllUsersByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/get-all-users-by-office-id.dto-out").GetAllUsersByOfficeIdDtoOut;
    }>;
}
