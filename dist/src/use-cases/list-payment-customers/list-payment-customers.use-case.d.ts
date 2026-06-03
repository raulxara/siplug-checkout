import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { GetAllPaymentCustomersByOfficeIdService } from '../../modules/payment-customers/services/get-all-payment-customers-by-office-id/get-all-payment-customers-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListPaymentCustomersDtoIn } from './dtos/list-payment-customers.dto-in';
import { ListPaymentCustomersDtoOut } from './dtos/list-payment-customers.dto-out';
export declare class ListPaymentCustomersUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly getAllPaymentCustomersByOfficeIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, getAllPaymentCustomersByOfficeIdService: GetAllPaymentCustomersByOfficeIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListPaymentCustomersDtoIn): Promise<ListPaymentCustomersDtoOut>;
    private matchesSearch;
}
