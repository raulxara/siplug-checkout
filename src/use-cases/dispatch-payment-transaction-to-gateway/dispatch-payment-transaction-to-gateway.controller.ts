import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { DispatchPaymentTransactionToGatewayDtoIn } from './dtos/dispatch-payment-transaction-to-gateway.dto-in';
import { DispatchPaymentTransactionToGatewayRequest } from './http/dispatch-payment-transaction-to-gateway.request';
import { DispatchPaymentTransactionToGatewayUseCase } from './dispatch-payment-transaction-to-gateway.use-case';

@Controller('payments')
export class DispatchPaymentTransactionToGatewayController {
  constructor(
    private readonly dispatchPaymentTransactionToGatewayUseCase: DispatchPaymentTransactionToGatewayUseCase,
  ) {}

  @Post('dispatch-to-gateway')
  async handle(
    @Body() body: DispatchPaymentTransactionToGatewayRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';

      const dtoOut = await this.dispatchPaymentTransactionToGatewayUseCase.exec(
          new DispatchPaymentTransactionToGatewayDtoIn({
            token,
            paymentTransactionId: body.paymentTransactionId,
          }),
        );

      return {
        status: 'success',
        message: 'payment transaction dispatched to gateway successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on dispatch payment transaction to gateway controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
