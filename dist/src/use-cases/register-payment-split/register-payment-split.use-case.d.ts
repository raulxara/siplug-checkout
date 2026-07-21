import { CreatePaymentSplitRecipientService } from '../../modules/payment-split-recipients/services/create-payment-split-recipient/create-payment-split-recipient.service';
import { CreatePaymentSplitService } from '../../modules/payment-splits/services/create-payment-split/create-payment-split.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CalculatePaymentSplitService } from '../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service';
import { RegisterPaymentSplitDtoIn } from './dtos/register-payment-split.dto-in';
import { RegisterPaymentSplitDtoOut } from './dtos/register-payment-split.dto-out';
export declare class RegisterPaymentSplitUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly calculatePaymentSplitService;
    private readonly createPaymentSplitService;
    private readonly createPaymentSplitRecipientService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, calculatePaymentSplitService: CalculatePaymentSplitService, createPaymentSplitService: CreatePaymentSplitService, createPaymentSplitRecipientService: CreatePaymentSplitRecipientService);
    exec(dtoIn: RegisterPaymentSplitDtoIn): Promise<RegisterPaymentSplitDtoOut>;
}
