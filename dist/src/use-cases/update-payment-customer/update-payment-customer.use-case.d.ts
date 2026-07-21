import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';
import { UpdatePaymentCustomerService } from '../../modules/payment-customers/services/update-payment-customer/update-payment-customer.service';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdatePaymentCustomerDtoIn } from './dtos/update-payment-customer.dto-in';
import { UpdatePaymentCustomerDtoOut } from './dtos/update-payment-customer.dto-out';
export declare class UpdatePaymentCustomerUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findPaymentCustomerByUniqueIdService;
    private readonly findOfficeByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly findProfileByUniqueIdService;
    private readonly updatePaymentCustomerService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, findProfileByUniqueIdService: FindProfileByUniqueIdService, updatePaymentCustomerService: UpdatePaymentCustomerService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: UpdatePaymentCustomerDtoIn): Promise<UpdatePaymentCustomerDtoOut>;
}
