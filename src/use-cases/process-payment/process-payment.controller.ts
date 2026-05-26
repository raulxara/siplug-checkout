import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { ProcessPaymentDtoIn } from './dtos/process-payment.dto-in';
import { ProcessPaymentRequest } from './http/process-payment.request';
import { ProcessPaymentUseCase } from './process-payment.use-case';

@Controller('payments')
export class ProcessPaymentController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Post('process')
  async handle(
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
          installments: body.installments ?? null,
          installmentAmount: body.installmentAmount ?? null,
          interestAmount: body.interestAmount ?? null,
          interestType: body.interestType ?? null,
          idempotencyKey: body.idempotencyKey ?? null,
          externalReference: body.externalReference ?? null,
          payer: body.payer ?? null,
          paymentData: body.paymentData ?? null,
          metadata: body.metadata ?? null,
          config: body.config ?? null,
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
