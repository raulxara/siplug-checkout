import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { GetAllSubscriptionInvoicesByOfficeIdDtoIn } from './dtos/get-all-subscription-invoices-by-office-id.dto-in';
import { GetAllSubscriptionInvoicesByOfficeIdDtoOut } from './dtos/get-all-subscription-invoices-by-office-id.dto-out';
export declare class GetAllSubscriptionInvoicesByOfficeIdService {
    private readonly subscriptionInvoicesRepository;
    constructor(subscriptionInvoicesRepository: ISubscriptionInvoicesRepository);
    exec(dtoIn: GetAllSubscriptionInvoicesByOfficeIdDtoIn): Promise<GetAllSubscriptionInvoicesByOfficeIdDtoOut>;
}
