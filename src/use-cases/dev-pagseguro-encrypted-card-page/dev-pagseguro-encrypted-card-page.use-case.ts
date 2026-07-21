import { Injectable } from '@nestjs/common';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { DevPagSeguroEncryptedCardPageDtoIn } from './dtos/dev-pagseguro-encrypted-card-page.dto-in';
import { DevPagSeguroEncryptedCardPageDtoOut } from './dtos/dev-pagseguro-encrypted-card-page.dto-out';

@Injectable()
export class DevPagSeguroEncryptedCardPageUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
  ) {}

  async exec(
    dtoIn: DevPagSeguroEncryptedCardPageDtoIn,
  ): Promise<DevPagSeguroEncryptedCardPageDtoOut> {
    this.ensureNonProductionEnvironment();

    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId),
      );

    const apiCredential = apiCredentialDtoOut.apiCredential;
    const publicKey = this.resolvePublicKey(apiCredential.config);

    return new DevPagSeguroEncryptedCardPageDtoOut(
      this.buildHtmlPage(publicKey),
    );
  }

  private ensureNonProductionEnvironment(): void {
    const nodeEnv = String(process.env.NODE_ENV ?? '').toLowerCase();
    const appEnv = String(process.env.APP_ENV ?? '').toLowerCase();

    const isProduction =
      nodeEnv === 'production' ||
      appEnv === 'production' ||
      appEnv === 'prod';

    if (isProduction) {
      throw new Error(
        'temporary PagSeguro encrypted card page is not allowed in production',
      );
    }
  }

  private resolvePublicKey(config: Record<string, unknown> | null): string {
    if (config === null) {
      throw new Error('api credential config is required');
    }

    const publicKey =
      this.toNullableString(config.publicKey) ??
      this.toNullableString(config.public_key) ??
      this.toNullableString(config.pagSeguroPublicKey) ??
      this.toNullableString(config.pagseguroPublicKey) ??
      this.toNullableString(config.pagseguro_public_key);

    if (publicKey === null) {
      throw new Error('PagSeguro publicKey is required in api credential config');
    }

    return publicKey;
  }

  private buildHtmlPage(publicKey: string): string {
    const safePublicKey = JSON.stringify(publicKey);

    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>PagSeguro Encrypted Card - Dev</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 760px;
      margin: 40px auto;
      padding: 0 20px;
      background: #f5f5f5;
      color: #121212;
    }

    .card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 8px 24px rgba(0,0,0,.08);
    }

    label {
      display: block;
      margin-top: 14px;
      font-weight: 700;
    }

    input, textarea, button {
      width: 100%;
      box-sizing: border-box;
      margin-top: 6px;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #ddd;
      font-size: 14px;
    }

    button {
      margin-top: 20px;
      border: 0;
      background: #008ce3;
      color: white;
      cursor: pointer;
      font-weight: 700;
    }

    textarea {
      min-height: 160px;
      font-family: monospace;
    }

    .warning {
      background: #fff3cd;
      border: 1px solid #ffe69c;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 18px;
    }

    .error {
      color: #b00020;
      margin-top: 12px;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>PagSeguro Encrypted Card - DEV</h1>

    <div class="warning">
      Use apenas em ambiente local/teste. Em produção, o cartão deve ser criptografado no checkout real, antes de enviar para o backend.
    </div>

    <label>Número do cartão</label>
    <input id="cardNumber" value="4111111111111111" />

    <label>CVV</label>
    <input id="securityCode" value="123" />

    <label>Mês de expiração</label>
    <input id="expMonth" value="12" />

    <label>Ano de expiração</label>
    <input id="expYear" value="2030" />

    <label>Nome impresso no cartão</label>
    <input id="holder" value="Cliente Teste" />

    <button onclick="generateEncryptedCard()">Gerar encryptedCard</button>

    <label>encryptedCard</label>
    <textarea id="encryptedCard" readonly></textarea>

    <div id="error" class="error"></div>
  </div>

  <script src="https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js"></script>

  <script>
    const publicKey = ${safePublicKey};

    function generateEncryptedCard() {
      document.getElementById('error').textContent = '';
      document.getElementById('encryptedCard').value = '';

      try {
        const card = PagSeguro.encryptCard({
          publicKey,
          holder: document.getElementById('holder').value,
          number: document.getElementById('cardNumber').value.replace(/\\D/g, ''),
          expMonth: document.getElementById('expMonth').value,
          expYear: document.getElementById('expYear').value,
          securityCode: document.getElementById('securityCode').value.replace(/\\D/g, ''),
        });

        if (card.hasErrors) {
          document.getElementById('error').textContent = JSON.stringify(card.errors, null, 2);
          return;
        }

        document.getElementById('encryptedCard').value = card.encryptedCard;
      } catch (error) {
        document.getElementById('error').textContent =
          error instanceof Error ? error.message : String(error);
      }
    }
  </script>
</body>
</html>`;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}