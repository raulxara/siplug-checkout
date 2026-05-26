import { Inject, Injectable } from '@nestjs/common';
import { PaymentCustomerEntity } from '../../entities/payment-customer.entity';
import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { PAYMENT_CUSTOMERS_REPOSITORY } from '../../tokens/payment-customers.tokens';
import { CreatePaymentCustomerDtoIn } from './dtos/create-payment-customer.dto-in';
import { CreatePaymentCustomerDtoOut } from './dtos/create-payment-customer.dto-out';

@Injectable()
export class CreatePaymentCustomerService {
  constructor(
    @Inject(PAYMENT_CUSTOMERS_REPOSITORY)
    private readonly repository: IPaymentCustomersRepository,
  ) {}

  async exec(
    dtoIn: CreatePaymentCustomerDtoIn,
  ): Promise<CreatePaymentCustomerDtoOut> {
    try {
      const entity = new PaymentCustomerEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.clientId = dtoIn.clientId;
      entity.profileId = dtoIn.profileId;
      entity.externalReference = dtoIn.externalReference;
      entity.name = dtoIn.name;
      entity.email = dtoIn.email;
      entity.documentType = dtoIn.documentType;
      entity.documentValue = dtoIn.documentValue;
      entity.phone = dtoIn.phone;
      entity.billingAddress = dtoIn.billingAddress;
      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreatePaymentCustomerDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create payment customer';

      throw new Error(message);
    }
  }
}