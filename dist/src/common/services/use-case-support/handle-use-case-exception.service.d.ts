import { DispatchLogProviderService } from '../log-provider-dispatch/dispatch-log-provider.service';
import { HandleUseCaseExceptionDtoIn } from './dtos/handle-use-case-exception.dto-in';
export declare class HandleUseCaseExceptionService {
    private readonly dispatchLogProviderService;
    constructor(dispatchLogProviderService: DispatchLogProviderService);
    exec(dtoIn: HandleUseCaseExceptionDtoIn): Promise<void>;
    private sanitizeContext;
    private sanitizeString;
    private isSensitiveKey;
}
