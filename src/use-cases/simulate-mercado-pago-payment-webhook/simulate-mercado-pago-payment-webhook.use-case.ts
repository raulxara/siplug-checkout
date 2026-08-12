import { Injectable } from '@nestjs/common';

import { ReceiveMercadoPagoWebhookDtoIn } from '../receive-mercado-pago-webhook/dtos/receive-mercado-pago-webhook.dto-in';
import { ReceiveMercadoPagoWebhookUseCase } from '../receive-mercado-pago-webhook/receive-mercado-pago-webhook.use-case';
import { SimulateMercadoPagoPaymentWebhookDtoIn } from './dtos/simulate-mercado-pago-payment-webhook.dto-in';

@Injectable()
export class SimulateMercadoPagoPaymentWebhookUseCase {
  constructor(
    private readonly receiveMercadoPagoWebhookUseCase: ReceiveMercadoPagoWebhookUseCase,
  ) {}

  async exec(dtoIn: SimulateMercadoPagoPaymentWebhookDtoIn) {
    this.ensureLocalEnvironment();

    const payload = {
      action: 'payment.updated',
      api_version: 'v1',
      data: {
        id: dtoIn.paymentId,
      },
      date_created: new Date().toISOString(),
      id: dtoIn.eventId,
      live_mode: false,
      type: 'payment',
      user_id: dtoIn.userId,
    };

    return await this.receiveMercadoPagoWebhookUseCase.exec(
      new ReceiveMercadoPagoWebhookDtoIn({
        apiCredentialId: dtoIn.apiCredentialId,
        payload,
        queryParams: {
          source_news: 'dev-simulator',
          type: 'payment',
          'data.id': dtoIn.paymentId,
          dev_skip_signature: 'true',
        },
        headers: {
          'x-dev-simulator': 'true',
        },
        xSignature: '',
        xRequestId: '',
        devSkipSignature: true,
      }),
    );
  }

  private ensureLocalEnvironment(): void {
    const appEnv = String(
      process.env.APP_ENV ?? process.env.NODE_ENV ?? '',
    )
      .trim()
      .toLowerCase();

    const allowed = ['local', 'development', 'dev', 'test'];

    if (!allowed.includes(appEnv)) {
      throw new Error(
        'simulate mercado pago webhook endpoint is available only in local/development/test environment',
      );
    }
  }
}