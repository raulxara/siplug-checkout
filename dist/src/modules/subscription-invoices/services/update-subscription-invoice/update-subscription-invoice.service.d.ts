import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { UpdateSubscriptionInvoiceDtoIn } from './dtos/update-subscription-invoice.dto-in';
import { UpdateSubscriptionInvoiceDtoOut } from './dtos/update-subscription-invoice.dto-out';
export declare class UpdateSubscriptionInvoiceService {
    private readonly repository;
    constructor(repository: ISubscriptionInvoicesRepository);
    exec(dtoIn: UpdateSubscriptionInvoiceDtoIn): Promise<UpdateSubscriptionInvoiceDtoOut>;
    private buildChangesHistory;
    private appendChange;
}
