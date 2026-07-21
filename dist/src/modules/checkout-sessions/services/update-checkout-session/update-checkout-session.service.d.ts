import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ICheckoutSessionsRepository } from '../../entities/checkout-sessions-repository.interface';
import { UpdateCheckoutSessionDtoIn } from './dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionDtoOut } from './dtos/update-checkout-session.dto-out';
export declare class UpdateCheckoutSessionService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: ICheckoutSessionsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateCheckoutSessionDtoIn): Promise<UpdateCheckoutSessionDtoOut>;
    private removeNullValues;
    private buildOldData;
}
