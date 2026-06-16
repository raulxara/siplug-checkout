import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { ReservePaymentSplitDispatchDtoIn } from './dtos/reserve-payment-split-dispatch.dto-in';
import { ReservePaymentSplitDispatchDtoOut } from './dtos/reserve-payment-split-dispatch.dto-out';
export declare class ReservePaymentSplitDispatchService {
    private readonly paymentSplitsRepository;
    constructor(paymentSplitsRepository: IPaymentSplitsRepository);
    exec(dtoIn: ReservePaymentSplitDispatchDtoIn): Promise<ReservePaymentSplitDispatchDtoOut>;
    private toObject;
}
