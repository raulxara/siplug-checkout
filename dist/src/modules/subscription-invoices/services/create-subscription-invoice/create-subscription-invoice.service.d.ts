import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { CreateSubscriptionInvoiceDtoIn } from './dtos/create-subscription-invoice.dto-in';
import { CreateSubscriptionInvoiceDtoOut } from './dtos/create-subscription-invoice.dto-out';
export declare class CreateSubscriptionInvoiceService {
    private readonly repository;
    constructor(repository: ISubscriptionInvoicesRepository);
    exec(dtoIn: CreateSubscriptionInvoiceDtoIn): Promise<CreateSubscriptionInvoiceDtoOut>;
    private toRow;
    private requiredNumber;
    private requiredString;
}
