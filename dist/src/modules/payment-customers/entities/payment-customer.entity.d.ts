import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPaymentCustomersRepository } from './payment-customers-repository.interface';
export declare class PaymentCustomerEntity extends AbstractEntity {
    private readonly repository;
    officeId: string;
    clientId: string;
    profileId: string | null;
    externalReference: string | null;
    name: string;
    email: string | null;
    documentType: string | null;
    documentValue: string | null;
    phone: string | null;
    billingAddress: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IPaymentCustomersRepository);
    create(): Promise<PaymentCustomerEntity>;
}
