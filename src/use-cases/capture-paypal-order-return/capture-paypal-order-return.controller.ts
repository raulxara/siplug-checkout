import { Controller, Get, Param, Query } from '@nestjs/common';

import { CapturePayPalOrderReturnDtoIn } from './dtos/capture-paypal-order-return.dto-in';
import { CapturePayPalOrderReturnUseCase } from './capture-paypal-order-return.use-case';

@Controller('paypal/checkout')
export class CapturePayPalOrderReturnController {
  constructor(
    private readonly capturePayPalOrderReturnUseCase: CapturePayPalOrderReturnUseCase,
  ) {}

  @Get('return/:apiCredentialId')
  async captureReturn(
    @Param('apiCredentialId') apiCredentialId: string,
    @Query('token') token: string,
  ) {
    const dtoOut = await this.capturePayPalOrderReturnUseCase.exec(
      new CapturePayPalOrderReturnDtoIn({
        apiCredentialId,
        orderId: token,
      }),
    );

    return {
      status: 'success',
      message: 'paypal order captured successfully',
      data: {
        paymentWebhookEvent: dtoOut.paymentWebhookEvent,
        paymentTransaction: dtoOut.paymentTransaction,
        processingResult: dtoOut.processingResult,
        providerResponse: dtoOut.providerResponse,
        wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
      },
    };
  }

  @Get('cancel/:apiCredentialId')
  async cancelReturn(
    @Param('apiCredentialId') apiCredentialId: string,
    @Query('token') token: string,
  ) {
    const dtoOut = await this.capturePayPalOrderReturnUseCase.execCancel(
      new CapturePayPalOrderReturnDtoIn({
        apiCredentialId,
        orderId: token,
      }),
    );

    return {
      status: 'success',
      message: 'paypal payment approval canceled by payer',
      data: {
        paymentWebhookEvent: dtoOut.paymentWebhookEvent,
        paymentTransaction: dtoOut.paymentTransaction,
        processingResult: dtoOut.processingResult,
        wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
      },
    };
  }
}
