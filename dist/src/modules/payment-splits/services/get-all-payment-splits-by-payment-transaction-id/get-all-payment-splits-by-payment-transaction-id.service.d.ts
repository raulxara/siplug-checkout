import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { GetAllPaymentSplitsByPaymentTransactionIdDtoIn } from './dtos/get-all-payment-splits-by-payment-transaction-id.dto-in';
import { GetAllPaymentSplitsByPaymentTransactionIdDtoOut } from './dtos/get-all-payment-splits-by-payment-transaction-id.dto-out';
export declare class GetAllPaymentSplitsByPaymentTransactionIdService {
    private readonly paymentSplitsRepository;
    constructor(paymentSplitsRepository: IPaymentSplitsRepository);
    exec(dtoIn: GetAllPaymentSplitsByPaymentTransactionIdDtoIn): Promise<GetAllPaymentSplitsByPaymentTransactionIdDtoOut>;
}
