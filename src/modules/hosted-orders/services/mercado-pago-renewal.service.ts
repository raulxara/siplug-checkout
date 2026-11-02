import { RestoreRenewalAmountDtoIn } from '../dtos/restore-renewal-amount.dto-in';
import { Injectable } from '@nestjs/common';
import { DecryptApiCredentialSecretService } from '../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { DecryptApiCredentialSecretDtoIn } from '../../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
@Injectable()
export class MercadoPagoRenewalService {
  constructor(private readonly decrypt: DecryptApiCredentialSecretService) {}
  async restore(input: RestoreRenewalAmountDtoIn) {
    const decoded = this.decrypt.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: { config: { token: input.token } },
        keysToDecrypt: ['token'],
        strict: true,
      }),
    );
    const token = (decoded.apiCredential.config as Record<string, string>)
      .token;
    const url =
      'https://api.mercadopago.com/preapproval/' +
      encodeURIComponent(input.subscriptionId);
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Unable to read recurring amount');
    const current = (await response.json()) as {
      id: string;
      external_reference: string;
      status: string;
      auto_recurring: { transaction_amount: number; currency_id: string };
    };
    if (
      current.id !== input.subscriptionId ||
      current.external_reference !== input.reference ||
      current.status !== 'authorized' ||
      current.auto_recurring?.currency_id !== input.currency
    )
      throw new Error('Subscription does not match order');
    const amount = Math.round(current.auto_recurring.transaction_amount * 100);
    if (amount === input.renewalAmount) return; // Recovery after remote success/local failure.
    if (amount !== input.firstAmount)
      throw new Error('Recurring amount changed independently');
    const updated = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        auto_recurring: {
          transaction_amount: input.renewalAmount / 100,
          currency_id: input.currency,
        },
      }),
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });
    if (!updated.ok) throw new Error('Unable to restore recurring amount');
    const result = (await updated.json()) as {
      id: string;
      auto_recurring?: { transaction_amount: number };
    };
    if (
      result.id !== input.subscriptionId ||
      Math.round((result.auto_recurring?.transaction_amount ?? -1) * 100) !==
        input.renewalAmount
    )
      throw new Error('Recurring amount was not confirmed');
  }
}
