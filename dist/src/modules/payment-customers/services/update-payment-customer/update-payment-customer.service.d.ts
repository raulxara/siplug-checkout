import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { UpdatePaymentCustomerDtoIn } from './dtos/update-payment-customer.dto-in';
import { UpdatePaymentCustomerDtoOut } from './dtos/update-payment-customer.dto-out';
export declare class UpdatePaymentCustomerService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPaymentCustomersRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePaymentCustomerDtoIn): Promise<UpdatePaymentCustomerDtoOut>;
    private removeNullValues;
    private buildOldData;
}
