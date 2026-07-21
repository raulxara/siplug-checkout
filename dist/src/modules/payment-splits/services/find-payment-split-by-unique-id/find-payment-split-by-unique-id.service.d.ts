import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { FindPaymentSplitByUniqueIdDtoIn } from './dtos/find-payment-split-by-unique-id.dto-in';
import { FindPaymentSplitByUniqueIdDtoOut } from './dtos/find-payment-split-by-unique-id.dto-out';
export declare class FindPaymentSplitByUniqueIdService {
    private readonly paymentSplitsRepository;
    constructor(paymentSplitsRepository: IPaymentSplitsRepository);
    exec(dtoIn: FindPaymentSplitByUniqueIdDtoIn): Promise<FindPaymentSplitByUniqueIdDtoOut>;
}
