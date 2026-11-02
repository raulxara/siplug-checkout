import { CheckoutGeneralSettingsService } from '../../modules/checkout-settings/services/checkout-general-settings.service';
import type { Response } from 'express';
import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';

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
    @Headers('accept') accept: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const dtoOut = await this.capturePayPalOrderReturnUseCase.exec(
      new CapturePayPalOrderReturnDtoIn({
        apiCredentialId,
        orderId: token,
      }),
    );

    if (accept?.includes('text/html'))
      return response.redirect(303, this.returnUrl('retorno', dtoOut.paymentTransaction));
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
    @Headers('accept') accept: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const dtoOut = await this.capturePayPalOrderReturnUseCase.execCancel(
      new CapturePayPalOrderReturnDtoIn({
        apiCredentialId,
        orderId: token,
      }),
    );

    if (accept?.includes('text/html'))
      return response.redirect(303, this.returnUrl('cancelado', dtoOut.paymentTransaction));
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
  private returnUrl(result: string, transaction: Record<string, unknown> | null): string {
    const config = transaction?.config as Record<string, unknown> | undefined;
    const snapshot = config?.checkoutSettingsSnapshot as Record<string, unknown> | undefined;
    if (snapshot) return CheckoutGeneralSettingsService.url(result === 'retorno' ? snapshot.successUrl : snapshot.cancelUrl);
    let url: URL;
    try {
      url = new URL(process.env.CHECKOUT_FRONTEND_URL ?? '');
    } catch {
      throw new ServiceUnavailableException();
    }
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/' ||
      (url.protocol !== 'https:' &&
        !(
          process.env.NODE_ENV !== 'production' &&
          url.protocol === 'http:' &&
          ['localhost', '127.0.0.1'].includes(url.hostname)
        ))
    )
      throw new ServiceUnavailableException();
    return url.origin + '/pagamento/' + result;
  }
}
