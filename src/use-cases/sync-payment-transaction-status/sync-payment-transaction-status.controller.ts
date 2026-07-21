import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SyncPaymentTransactionStatusDtoIn } from './dtos/sync-payment-transaction-status.dto-in';
import { SyncPaymentTransactionStatusRequest } from './http/sync-payment-transaction-status.request';
import { SyncPaymentTransactionStatusUseCase } from './sync-payment-transaction-status.use-case';

@Controller('payment-transactions')
export class SyncPaymentTransactionStatusController {
  constructor(
    private readonly syncPaymentTransactionStatusUseCase: SyncPaymentTransactionStatusUseCase,
  ) {}

  @Post('sync-status')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: SyncPaymentTransactionStatusRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.syncPaymentTransactionStatusUseCase.exec(
        new SyncPaymentTransactionStatusDtoIn({
          token: this.extractBearerToken(authorization),
          paymentTransactionId: body.paymentTransactionId,
          force: body.force ?? false,
        }),
      );

      return {
        status: 'success',
        message: 'payment transaction status synchronized successfully',
        data: {
          synced: dtoOut.synced,
          message: dtoOut.message,
          paymentTransaction: dtoOut.paymentTransaction,
          checkoutSession: dtoOut.checkoutSession,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on sync payment transaction status';

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
