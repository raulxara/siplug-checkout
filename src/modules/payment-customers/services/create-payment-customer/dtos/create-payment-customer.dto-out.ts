import type { PaymentCustomerEntity } from '../../../entities/payment-customer.entity';

export class CreatePaymentCustomerDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly officeId: string,
    public readonly clientId: string,
    public readonly profileId: string | null,
    public readonly externalReference: string | null,
    public readonly name: string,
    public readonly email: string | null,
    public readonly documentType: string | null,
    public readonly documentValue: string | null,
    public readonly phone: string | null,
    public readonly billingAddress: Record<string, unknown> | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: PaymentCustomerEntity): CreatePaymentCustomerDtoOut {
    return new CreatePaymentCustomerDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.officeId,
      entity.clientId,
      entity.profileId,
      entity.externalReference,
      entity.name,
      entity.email,
      entity.documentType,
      entity.documentValue,
      entity.phone,
      entity.billingAddress,
      entity.metadata,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}