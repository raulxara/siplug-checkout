import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ICheckoutSessionItemsRepository } from '../../entities/checkout-session-items-repository.interface';
import { UpdateCheckoutSessionItemDtoIn } from './dtos/update-checkout-session-item.dto-in';
import { UpdateCheckoutSessionItemDtoOut } from './dtos/update-checkout-session-item.dto-out';
export declare class UpdateCheckoutSessionItemService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: ICheckoutSessionItemsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateCheckoutSessionItemDtoIn): Promise<UpdateCheckoutSessionItemDtoOut>;
    private removeNullValues;
    private buildOldData;
}
