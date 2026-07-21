import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ProcessRecurringPaymentDtoIn } from './dtos/process-recurring-payment.dto-in';
import { ProcessRecurringPaymentRequest } from './http/process-recurring-payment.request';
import { ProcessRecurringPaymentUseCase } from './process-recurring-payment.use-case';

@Controller('payments')
export class ProcessRecurringPaymentController {
  constructor(
    private readonly processRecurringPaymentUseCase: ProcessRecurringPaymentUseCase,
  ) {}

  @Post('process-recurring')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: ProcessRecurringPaymentRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.processRecurringPaymentUseCase.exec(
        new ProcessRecurringPaymentDtoIn({
          token: this.extractBearerToken(authorization),

          checkoutSessionId: body.checkoutSessionId,
          paymentMethod: body.paymentMethod,

          gatewayProvider: body.gatewayProvider ?? null,
          gatewaySlug: body.gatewaySlug ?? null,
          gatewayId: body.gatewayId ?? null,
          apiCredentialId: body.apiCredentialId ?? null,

          payer: body.payer ?? null,
          paymentData: body.paymentData ?? null,

          metadata: body.metadata ?? null,
          config: body.config ?? null,
        }),
      );

      return {
        status: 'success',
        message: 'recurring payment processed successfully',
        data: {
          subscription: dtoOut.subscription,
          subscriptionCycle: dtoOut.subscriptionCycle,
          subscriptionInvoice: dtoOut.subscriptionInvoice,
          paymentTransaction: dtoOut.paymentTransaction,
          checkoutSession: dtoOut.checkoutSession,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on process recurring payment';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }

  private extractBearerToken(authorization: string | undefined): string {
    if (!authorization || authorization.trim() === '') {
      throw new Error('authorization header is required');
    }

    return authorization.replace(/^Bearer\s+/i, '').trim();
  }
}
