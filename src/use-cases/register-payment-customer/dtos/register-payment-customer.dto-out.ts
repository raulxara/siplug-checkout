import { CreatePaymentCustomerDtoOut } from '../../../modules/payment-customers/services/create-payment-customer/dtos/create-payment-customer.dto-out';

export class RegisterPaymentCustomerDtoOut {
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

  static fromCreatePaymentCustomerDtoOut(
    dtoOut: CreatePaymentCustomerDtoOut,
  ): RegisterPaymentCustomerDtoOut {
    return new RegisterPaymentCustomerDtoOut(
      dtoOut.id,
      dtoOut._id,
      dtoOut.officeId,
      dtoOut.clientId,
      dtoOut.profileId,
      dtoOut.externalReference,
      dtoOut.name,
      dtoOut.email,
      dtoOut.documentType,
      dtoOut.documentValue,
      dtoOut.phone,
      dtoOut.billingAddress,
      dtoOut.metadata,
      dtoOut.config,
      dtoOut.changesHistory,
      dtoOut.status,
      dtoOut.createdAt,
      dtoOut.updatedAt,
    );
  }
}