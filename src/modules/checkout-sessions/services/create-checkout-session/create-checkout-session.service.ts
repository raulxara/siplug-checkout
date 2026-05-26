import { Inject, Injectable } from '@nestjs/common';
import { CheckoutSessionEntity } from '../../entities/checkout-session.entity';
import type { ICheckoutSessionsRepository } from '../../entities/checkout-sessions-repository.interface';
import { CHECKOUT_SESSIONS_REPOSITORY } from '../../tokens/checkout-sessions.tokens';
import { CreateCheckoutSessionDtoIn } from './dtos/create-checkout-session.dto-in';
import { CreateCheckoutSessionDtoOut } from './dtos/create-checkout-session.dto-out';

@Injectable()
export class CreateCheckoutSessionService {
  constructor(
    @Inject(CHECKOUT_SESSIONS_REPOSITORY)
    private readonly repository: ICheckoutSessionsRepository,
  ) {}

  async exec(
    dtoIn: CreateCheckoutSessionDtoIn,
  ): Promise<CreateCheckoutSessionDtoOut> {
    try {
      const entity = new CheckoutSessionEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.clientId = dtoIn.clientId;
      entity.paymentCustomerId = dtoIn.paymentCustomerId;
      entity.gatewayId = dtoIn.gatewayId;
      entity.apiCredentialId = dtoIn.apiCredentialId;

      entity.code = dtoIn.code;
      entity.externalReference = dtoIn.externalReference;
      entity.idempotencyKey = dtoIn.idempotencyKey;

      entity.paymentType = dtoIn.paymentType;
      entity.amount = dtoIn.amount;
      entity.currency = dtoIn.currency;
      entity.description = dtoIn.description;

      entity.successUrl = dtoIn.successUrl;
      entity.cancelUrl = dtoIn.cancelUrl;
      entity.expiresAt = dtoIn.expiresAt;

      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;

      entity.status = dtoIn.status;

      await entity.create();

      return CreateCheckoutSessionDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create checkout session';

      throw new Error(message);
    }
  }
}