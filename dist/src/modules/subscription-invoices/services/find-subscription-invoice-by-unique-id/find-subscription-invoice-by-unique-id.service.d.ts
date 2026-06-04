import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { FindSubscriptionInvoiceByUniqueIdDtoIn } from './dtos/find-subscription-invoice-by-unique-id.dto-in';
import { FindSubscriptionInvoiceByUniqueIdDtoOut } from './dtos/find-subscription-invoice-by-unique-id.dto-out';
export declare class FindSubscriptionInvoiceByUniqueIdService {
    private readonly repository;
    constructor(repository: ISubscriptionInvoicesRepository);
    exec(dtoIn: FindSubscriptionInvoiceByUniqueIdDtoIn): Promise<FindSubscriptionInvoiceByUniqueIdDtoOut>;
}
