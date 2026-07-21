import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { GetAllPaymentCustomersByOfficeIdService } from '../../modules/payment-customers/services/get-all-payment-customers-by-office-id/get-all-payment-customers-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetPaymentCustomersByOfficeIdDtoIn } from './dtos/get-payment-customers-by-office-id.dto-in';
import { GetPaymentCustomersByOfficeIdDtoOut } from './dtos/get-payment-customers-by-office-id.dto-out';
export declare class GetPaymentCustomersByOfficeIdUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly getAllPaymentCustomersByOfficeIdService;
    private readonly findOfficeByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, getAllPaymentCustomersByOfficeIdService: GetAllPaymentCustomersByOfficeIdService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetPaymentCustomersByOfficeIdDtoIn): Promise<GetPaymentCustomersByOfficeIdDtoOut>;
}
