import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { GetAllSubscriptionInvoicesDtoOut } from './dtos/get-all-subscription-invoices.dto-out';
export declare class GetAllSubscriptionInvoicesService {
    private readonly subscriptionInvoicesRepository;
    constructor(subscriptionInvoicesRepository: ISubscriptionInvoicesRepository);
    exec(): Promise<GetAllSubscriptionInvoicesDtoOut>;
}
