import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetPaymentCustomerByUniqueIdDtoIn } from './dtos/get-payment-customer-by-unique-id.dto-in';
import { GetPaymentCustomerByUniqueIdDtoOut } from './dtos/get-payment-customer-by-unique-id.dto-out';
export declare class GetPaymentCustomerByUniqueIdUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findPaymentCustomerByUniqueIdService;
    private readonly findOfficeByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetPaymentCustomerByUniqueIdDtoIn): Promise<GetPaymentCustomerByUniqueIdDtoOut>;
}
