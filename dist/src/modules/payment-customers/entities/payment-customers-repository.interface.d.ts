import type { PaymentCustomerEntity } from './payment-customer.entity';
export type PaymentCustomerRow = {
    id: number;
    _id: string;
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
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IPaymentCustomersRepository {
    create(entity: PaymentCustomerEntity): Promise<PaymentCustomerEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentCustomerRow>;
    findByUniqueId(_id: string): Promise<PaymentCustomerRow | null>;
    getAll(): Promise<PaymentCustomerRow[]>;
    getAllByOfficeId(officeId: string): Promise<PaymentCustomerRow[]>;
}
