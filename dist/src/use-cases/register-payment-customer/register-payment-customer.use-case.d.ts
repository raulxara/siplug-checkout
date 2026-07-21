import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { CreatePaymentCustomerService } from '../../modules/payment-customers/services/create-payment-customer/create-payment-customer.service';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterPaymentCustomerDtoIn } from './dtos/register-payment-customer.dto-in';
import { RegisterPaymentCustomerDtoOut } from './dtos/register-payment-customer.dto-out';
export declare class RegisterPaymentCustomerUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly findProfileByUniqueIdService;
    private readonly createPaymentCustomerService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, findProfileByUniqueIdService: FindProfileByUniqueIdService, createPaymentCustomerService: CreatePaymentCustomerService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterPaymentCustomerDtoIn): Promise<RegisterPaymentCustomerDtoOut>;
}
