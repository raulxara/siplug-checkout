import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Put,
} from '@nestjs/common';
import { UpdateCheckoutSessionDtoIn } from './dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionRequest } from './http/update-checkout-session.request';
import { UpdateCheckoutSessionUseCase } from './update-checkout-session.use-case';

@Controller('checkout-sessions')
export class UpdateCheckoutSessionController {
  constructor(
    private readonly updateCheckoutSessionUseCase: UpdateCheckoutSessionUseCase,
  ) {}

  @Put('update')
  async handle(
    @Body() body: UpdateCheckoutSessionRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';

      const dtoOut = await this.updateCheckoutSessionUseCase.exec(
        new UpdateCheckoutSessionDtoIn({
          token,
          checkoutSessionId: body.checkoutSessionId,

          officeId: body.officeId ?? null,
          clientId: body.clientId ?? null,
          paymentCustomerId: body.paymentCustomerId ?? null,
          gatewayId: body.gatewayId ?? null,
          apiCredentialId: body.apiCredentialId ?? null,

          code: body.code ?? null,
          externalReference: body.externalReference ?? null,
          idempotencyKey: body.idempotencyKey ?? null,

          paymentType: body.paymentType ?? null,
          amount: body.amount ?? null,
          currency: body.currency ?? null,
          description: body.description ?? null,

          successUrl: body.successUrl ?? null,
          cancelUrl: body.cancelUrl ?? null,
          expiresAt: body.expiresAt ?? null,

          items: body.items ?? [],

          metadata: body.metadata ?? null,
          config: body.config ?? null,

          status: body.status ?? null,
          source: body.source ?? 'UpdateCheckoutSessionController',
        }),
      );

      return {
        status: 'success',
        message: 'checkout session updated successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update checkout session controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
