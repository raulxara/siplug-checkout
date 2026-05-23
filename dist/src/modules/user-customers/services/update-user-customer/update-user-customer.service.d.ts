import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { UpdateUserCustomerDtoIn } from './dtos/update-user-customer.dto-in';
import { UpdateUserCustomerDtoOut } from './dtos/update-user-customer.dto-out';
export declare class UpdateUserCustomerService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IUserCustomersRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateUserCustomerDtoIn): Promise<UpdateUserCustomerDtoOut>;
    private removeNullValues;
    private buildOldData;
}
