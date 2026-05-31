import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';

import { ProcessPaymentDtoIn } from './dtos/process-payment.dto-in';
import { ProcessPaymentRequest } from './http/process-payment.request';
import { ProcessPaymentUseCase } from './process-payment.use-case';

@Controller('payments')
export class ProcessPaymentController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Post('process')
  @HttpCode(200)
  async process(
    @Body() body: ProcessPaymentRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.processPaymentUseCase.exec(
        new ProcessPaymentDtoIn({
          token,

          checkoutSessionId: body.checkoutSessionId,
          paymentMethod: body.paymentMethod,

          gatewayProvider: body.gatewayProvider,
          gatewaySlug: body.gatewaySlug,
          gatewayId: body.gatewayId,
          apiCredentialId: body.apiCredentialId,

          idempotencyKey: body.idempotencyKey,
          externalReference: body.externalReference,

          installments: body.installments,
          installmentAmount: body.installmentAmount,
          interestAmount: body.interestAmount,
          interestType: body.interestType,

          payer: body.payer,
          paymentData: body.paymentData,
          metadata: body.metadata,
          config: body.config,
        }),
      );

      return {
        status: 'success',
        message: 'payment processed successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on process payment controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
