import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UpdatePaymentTransactionUseCaseDtoIn } from './dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionRequest } from './http/update-payment-transaction.request';
import { UpdatePaymentTransactionUseCase } from './update-payment-transaction.use-case';

@Controller('payment-transactions')
export class UpdatePaymentTransactionController {
  constructor(
    private readonly updatePaymentTransactionUseCase: UpdatePaymentTransactionUseCase,
  ) {}

  @Put('update')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: UpdatePaymentTransactionRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.updatePaymentTransactionUseCase.exec(
        new UpdatePaymentTransactionUseCaseDtoIn({
          token: this.extractBearerToken(authorization),
          paymentTransactionId: body.paymentTransactionId,

          status: body.status ?? null,
          gatewayStatus: body.gatewayStatus ?? null,
          processStatus: body.processStatus ?? null,
          processMessage: body.processMessage ?? null,

          qrCode: body.qrCode ?? null,
          qrCodeBase64: body.qrCodeBase64 ?? null,
          boletoUrl: body.boletoUrl ?? null,
          checkoutUrl: body.checkoutUrl ?? null,

          paidAt: body.paidAt ?? null,
          authorizedAt: body.authorizedAt ?? null,
          canceledAt: body.canceledAt ?? null,
          failedAt: body.failedAt ?? null,
          refundedAt: body.refundedAt ?? null,
          expiresAt: body.expiresAt ?? null,

          metadata: body.metadata ?? null,
          config: body.config ?? null,
        }),
      );

      return {
        status: 'success',
        message: 'payment transaction updated successfully',
        data: {
          paymentTransaction: dtoOut.paymentTransaction,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update payment transaction';

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
