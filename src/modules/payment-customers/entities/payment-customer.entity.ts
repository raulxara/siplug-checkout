import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPaymentCustomersRepository } from './payment-customers-repository.interface';

export class PaymentCustomerEntity extends AbstractEntity {
  public officeId!: string;
  public clientId!: string;
  public profileId: string | null = null;
  public externalReference: string | null = null;
  public name!: string;
  public email: string | null = null;
  public documentType: string | null = null;
  public documentValue: string | null = null;
  public phone: string | null = null;
  public billingAddress: Record<string, unknown> | null = null;
  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IPaymentCustomersRepository) {
    super();
  }

  async create(): Promise<PaymentCustomerEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      officeId: fresh.officeId,
      clientId: fresh.clientId,
      profileId: fresh.profileId,
      externalReference: fresh.externalReference,
      name: fresh.name,
      email: fresh.email,
      documentType: fresh.documentType,
      documentValue: fresh.documentValue,
      phone: fresh.phone,
      billingAddress: fresh.billingAddress,
      metadata: fresh.metadata,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}