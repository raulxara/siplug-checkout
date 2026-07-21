import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { RegisterCheckoutSessionDtoIn } from './dtos/register-checkout-session.dto-in';
import { RegisterCheckoutSessionRequest } from './http/register-checkout-session.request';
import { RegisterCheckoutSessionUseCase } from './register-checkout-session.use-case';

@Controller('checkout-sessions')
export class RegisterCheckoutSessionController {
  constructor(
    private readonly registerCheckoutSessionUseCase: RegisterCheckoutSessionUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() body: RegisterCheckoutSessionRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';

      const dtoOut = await this.registerCheckoutSessionUseCase.exec(
        new RegisterCheckoutSessionDtoIn({
          token,

          officeId: body.officeId,
          clientId: body.clientId,
          paymentCustomerId: body.paymentCustomerId ?? null,
          gatewayId: body.gatewayId,
          apiCredentialId: body.apiCredentialId ?? null,

          code: body.code ?? null,
          externalReference: body.externalReference ?? null,
          idempotencyKey: body.idempotencyKey ?? null,

          paymentType: body.paymentType,
          amount: body.amount,
          currency: body.currency ?? 'BRL',
          description: body.description ?? null,

          successUrl: body.successUrl ?? null,
          cancelUrl: body.cancelUrl ?? null,
          expiresAt: body.expiresAt ?? null,

          items: body.items,

          metadata: body.metadata ?? null,
          config: body.config ?? null,

          status: body.status ?? 'created',
        }),
      );

      return {
        status: 'success',
        message: 'checkout session registered successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register checkout session controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
