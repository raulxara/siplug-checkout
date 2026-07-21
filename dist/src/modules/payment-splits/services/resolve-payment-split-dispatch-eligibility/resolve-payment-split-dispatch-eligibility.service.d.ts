import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { ResolvePaymentSplitDispatchEligibilityDtoIn } from './dtos/resolve-payment-split-dispatch-eligibility.dto-in';
import { ResolvePaymentSplitDispatchEligibilityDtoOut } from './dtos/resolve-payment-split-dispatch-eligibility.dto-out';
export declare class ResolvePaymentSplitDispatchEligibilityService {
    private readonly paymentSplitsRepository;
    constructor(paymentSplitsRepository: IPaymentSplitsRepository);
    exec(dtoIn: ResolvePaymentSplitDispatchEligibilityDtoIn): Promise<ResolvePaymentSplitDispatchEligibilityDtoOut>;
    private extractStatus;
}
