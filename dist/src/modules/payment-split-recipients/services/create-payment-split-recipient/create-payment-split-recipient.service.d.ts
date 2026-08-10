import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { CreatePaymentSplitRecipientDtoIn } from './dtos/create-payment-split-recipient.dto-in';
import { CreatePaymentSplitRecipientDtoOut } from './dtos/create-payment-split-recipient.dto-out';
import { FindSplitRecipientByUniqueIdService } from '../../../split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
export declare class CreatePaymentSplitRecipientService {
    private readonly paymentSplitRecipientsRepository;
    private readonly findSplitRecipientByUniqueIdService;
    constructor(paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository, findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService);
    exec(dtoIn: CreatePaymentSplitRecipientDtoIn): Promise<CreatePaymentSplitRecipientDtoOut>;
    private toNullableString;
    private extractStringFromObject;
}
