import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from './dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoOut } from './dtos/get-all-payment-split-recipients-by-payment-split-id.dto-out';
export declare class GetAllPaymentSplitRecipientsByPaymentSplitIdService {
    private readonly paymentSplitRecipientsRepository;
    constructor(paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository);
    exec(dtoIn: GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn): Promise<GetAllPaymentSplitRecipientsByPaymentSplitIdDtoOut>;
}
