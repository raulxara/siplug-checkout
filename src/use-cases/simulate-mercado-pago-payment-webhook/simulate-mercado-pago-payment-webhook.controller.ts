import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { SimulateMercadoPagoPaymentWebhookDtoIn } from './dtos/simulate-mercado-pago-payment-webhook.dto-in';
import { SimulateMercadoPagoPaymentWebhookUseCase } from './simulate-mercado-pago-payment-webhook.use-case';

@Controller('dev/webhooks/mercado-pago')
export class SimulateMercadoPagoPaymentWebhookController {
  constructor(
    private readonly simulateMercadoPagoPaymentWebhookUseCase: SimulateMercadoPagoPaymentWebhookUseCase,
  ) {}

  @Post('simulate-payment')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.simulateMercadoPagoPaymentWebhookUseCase.exec(
      new SimulateMercadoPagoPaymentWebhookDtoIn({
        apiCredentialId: body.apiCredentialId,
        paymentId: body.paymentId,
        eventId: body.eventId,
        userId: body.userId,
      }),
    );

    return {
      status: 'success',
      message: 'mercado pago payment webhook simulated successfully',
      data: dtoOut,
    };
  }
}