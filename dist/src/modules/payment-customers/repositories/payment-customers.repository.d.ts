import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentCustomerEntity } from '../entities/payment-customer.entity';
import type { IPaymentCustomersRepository, PaymentCustomerRow } from '../entities/payment-customers-repository.interface';
export declare class PaymentCustomersRepository implements IPaymentCustomersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PaymentCustomerEntity): Promise<PaymentCustomerEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentCustomerRow>;
    findByUniqueId(_id: string): Promise<PaymentCustomerRow | null>;
    getAll(): Promise<PaymentCustomerRow[]>;
    getAllByOfficeId(officeId: string): Promise<PaymentCustomerRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
