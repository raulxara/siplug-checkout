import { Injectable } from '@nestjs/common';

import { GetMercadoPagoPaymentDtoIn } from './dtos/get-mercado-pago-payment.dto-in';
import { GetMercadoPagoPaymentDtoOut } from './dtos/get-mercado-pago-payment.dto-out';

@Injectable()
export class GetMercadoPagoPaymentService {
  async exec(
    dtoIn: GetMercadoPagoPaymentDtoIn,
  ): Promise<GetMercadoPagoPaymentDtoOut> {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(dtoIn.paymentId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${dtoIn.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const responseText = await response.text();
    const responseBody = this.parseJson(responseText);

    if (!response.ok) {
      throw new Error(
        `Mercado Pago get payment failed with status ${response.status}`,
      );
    }

    if (responseBody === null) {
      throw new Error('Mercado Pago payment response is invalid');
    }

    return new GetMercadoPagoPaymentDtoOut(responseBody, {
      statusCode: response.status,
      ok: response.ok,
      body: responseBody,
    });
  }

  private parseJson(value: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(value);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }

      return parsed as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
