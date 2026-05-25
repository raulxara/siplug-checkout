import { ListUsersRequest } from './http/list-users.request';
import { ListUsersUseCase } from './list-users.use-case';
export declare class ListUsersController {
    private readonly listUsersUseCase;
    constructor(listUsersUseCase: ListUsersUseCase);
    handle(body: ListUsersRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/list-users.dto-out").ListUsersDtoOut;
    }>;
}
