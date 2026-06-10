import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CalculatePaymentSplitService } from '../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service';
import { CalculatePaymentSplitDtoIn } from './dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitDtoOut } from './dtos/calculate-payment-split.dto-out';
export declare class CalculatePaymentSplitUseCase {
    private readonly calculatePaymentSplitService;
    private readonly resolveActorAuthorizationService;
    constructor(calculatePaymentSplitService: CalculatePaymentSplitService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: CalculatePaymentSplitDtoIn): Promise<CalculatePaymentSplitDtoOut>;
}
