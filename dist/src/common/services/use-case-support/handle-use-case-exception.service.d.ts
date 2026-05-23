import { HandleUseCaseExceptionDtoIn } from './dtos/handle-use-case-exception.dto-in';
export declare class HandleUseCaseExceptionService {
    exec(dtoIn: HandleUseCaseExceptionDtoIn): Promise<void>;
    private sanitizeContext;
}
