import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { CreatePaymentSplitRecipientDtoIn } from './dtos/create-payment-split-recipient.dto-in';
import { CreatePaymentSplitRecipientDtoOut } from './dtos/create-payment-split-recipient.dto-out';
export declare class CreatePaymentSplitRecipientService {
    private readonly paymentSplitRecipientsRepository;
    constructor(paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository);
    exec(dtoIn: CreatePaymentSplitRecipientDtoIn): Promise<CreatePaymentSplitRecipientDtoOut>;
}
