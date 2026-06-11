import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { GetAllPaymentSplitsByOfficeIdDtoIn } from './dtos/get-all-payment-splits-by-office-id.dto-in';
import { GetAllPaymentSplitsByOfficeIdDtoOut } from './dtos/get-all-payment-splits-by-office-id.dto-out';
export declare class GetAllPaymentSplitsByOfficeIdService {
    private readonly paymentSplitsRepository;
    constructor(paymentSplitsRepository: IPaymentSplitsRepository);
    exec(dtoIn: GetAllPaymentSplitsByOfficeIdDtoIn): Promise<GetAllPaymentSplitsByOfficeIdDtoOut>;
}
