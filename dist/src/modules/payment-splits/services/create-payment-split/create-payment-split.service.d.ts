import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { CreatePaymentSplitDtoIn } from './dtos/create-payment-split.dto-in';
import { CreatePaymentSplitDtoOut } from './dtos/create-payment-split.dto-out';
export declare class CreatePaymentSplitService {
    private readonly paymentSplitsRepository;
    constructor(paymentSplitsRepository: IPaymentSplitsRepository);
    exec(dtoIn: CreatePaymentSplitDtoIn): Promise<CreatePaymentSplitDtoOut>;
}
