import { Injectable } from '@nestjs/common';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { DevPicPayTemporaryCardTokenPageDtoIn } from './dtos/dev-picpay-temporary-card-token-page.dto-in';
import { DevPicPayTemporaryCardTokenPageDtoOut } from './dtos/dev-picpay-temporary-card-token-page.dto-out';

@Injectable()
export class DevPicPayTemporaryCardTokenPageUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
  ) {}

  async exec(
    dtoIn: DevPicPayTemporaryCardTokenPageDtoIn,
  ): Promise<DevPicPayTemporaryCardTokenPageDtoOut> {
    this.ensureNonProductionEnvironment();

    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId),
      );

    const apiCredential = apiCredentialDtoOut.apiCredential;
    const config = apiCredential.config;

    const merchantCredential = this.resolveMerchantCredential(config);
    const transparentToken = this.resolveTransparentToken(config);
    const environment = this.resolveEnvironment(config);

    return new DevPicPayTemporaryCardTokenPageDtoOut(
      this.buildHtmlPage({
        merchantCredential,
        transparentToken,
        environment,
      }),
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
        'temporary PicPay card token page is not allowed in production',
      );
    }
  }

  private resolveMerchantCredential(
    config: Record<string, unknown> | null,
  ): string {
    if (config === null) {
      throw new Error('api credential config is required');
    }

    const merchantCredential =
      this.toNullableString(config.merchantCredential) ??
      this.toNullableString(config.merchant_credential) ??
      this.toNullableString(config.merchantDocument) ??
      this.toNullableString(config.merchant_document) ??
      this.toNullableString(config.cnpj);

    if (merchantCredential === null) {
      throw new Error(
        'PicPay merchantCredential is required in api credential config',
      );
    }

    return merchantCredential.replace(/\D/g, '');
  }

  private resolveTransparentToken(
    config: Record<string, unknown> | null,
  ): string {
    if (config === null) {
      throw new Error('api credential config is required');
    }

    const transparentToken =
      this.toNullableString(config.transparentToken) ??
      this.toNullableString(config.transparent_token) ??
      this.toNullableString(config.picpayTransparentToken) ??
      this.toNullableString(config.picpay_transparent_token);

    if (transparentToken === null) {
      throw new Error(
        'PicPay transparentToken is required in api credential config',
      );
    }

    return transparentToken;
  }

  private resolveEnvironment(config: Record<string, unknown> | null): string {
    if (config === null) {
      return 'sandbox';
    }

    const environment =
      this.toNullableString(config.environment) ??
      this.toNullableString(config.env) ??
      'sandbox';

    return environment.toLowerCase().trim();
  }

  private buildHtmlPage(params: {
    merchantCredential: string;
    transparentToken: string;
    environment: string;
  }): string {
    const safeMerchantCredential = JSON.stringify(params.merchantCredential);
    const safeTransparentToken = JSON.stringify(params.transparentToken);

    const sdkUrl =
      params.environment === 'production' || params.environment === 'live'
        ? 'https://checkout.picpay.com/cdn/pp-transparent-v1.0.0.js'
        : 'https://checkout-qa.picpay.com/cdn/pp-transparent-v1.0.0.js';

    const safeSdkUrl = JSON.stringify(sdkUrl);

    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>PicPay Temporary Card Token - Dev</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 920px;
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
      margin-bottom: 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    label {
      display: block;
      margin-top: 14px;
      font-weight: 700;
    }

    input, textarea, button, select {
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
      background: #11c76f;
      color: white;
      cursor: pointer;
      font-weight: 700;
    }

    button.secondary {
      background: #008ce3;
    }

    textarea {
      min-height: 150px;
      font-family: monospace;
    }

    .warning {
      background: #fff3cd;
      border: 1px solid #ffe69c;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 18px;
      line-height: 1.5;
    }

    .status {
      background: #f0f0f0;
      border-radius: 8px;
      padding: 12px;
      margin-top: 12px;
      white-space: pre-wrap;
      font-family: monospace;
    }

    .error {
      color: #b00020;
    }

    .success {
      color: #067a3d;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>
  <div class="card">
    <h1>PicPay Temporary Card Token - DEV</h1>

    <div class="warning">
      Use apenas em ambiente local/dev. O cartão é tokenizado pelo SDK do PicPay no navegador.
      O backend da SiPlug deve receber apenas o <strong>temporaryCardToken</strong>.
      O token temporário tem validade curta; gere e use logo em seguida.
    </div>

    <div id="sdkStatus" class="status">Carregando SDK PicPay...</div>
  </div>

  <div class="card">
    <h2>Dados do cartão</h2>

    <div class="grid">
      <div>
        <label>Número do cartão</label>
        <input id="cardNumber" value="4111111111111111" />
      </div>

      <div>
        <label>CVV</label>
        <input id="cvv" value="123" />
      </div>
    </div>

    <div class="grid">
      <div>
        <label>Mês de expiração</label>
        <input id="expirationMonth" value="12" />
      </div>

      <div>
        <label>Ano de expiração</label>
        <input id="expirationYear" value="2030" />
      </div>
    </div>

    <div class="grid">
      <div>
        <label>Nome impresso no cartão</label>
        <input id="holderName" value="Cliente Recorrente PicPay" />
      </div>

      <div>
        <label>Documento do titular</label>
        <input id="holderDocument" value="12345678909" />
      </div>
    </div>

    <label>Bandeira</label>
    <input id="brand" value="Visa" />

    <button onclick="getCardBrand()" class="secondary">
      Obter bandeira pelo BIN
    </button>

    <button onclick="createTemporaryCard()">
      Gerar temporaryCardToken
    </button>

    <div id="tokenStatus" class="status">Token ainda não gerado.</div>
  </div>

  <div class="card">
    <h2>temporaryCardToken</h2>

    <label>Token</label>
    <textarea id="temporaryCardToken" readonly></textarea>

    <button onclick="copyTemporaryCardToken()">
      Copiar temporaryCardToken
    </button>
  </div>

  <div class="card">
    <h2>Body para /payments/process-recurring</h2>

    <label>Checkout Session ID</label>
    <input id="checkoutSessionId" placeholder="UUID_DA_CHECKOUT_SESSION_PICPAY" />

    <label>Body gerado</label>
    <textarea id="processRecurringBody" readonly></textarea>

    <button onclick="buildProcessRecurringBody()" class="secondary">
      Gerar body
    </button>

    <button onclick="copyProcessRecurringBody()">
      Copiar body
    </button>
  </div>

  <script>
    const sdkUrl = ${safeSdkUrl};
    const merchantCredential = ${safeMerchantCredential};
    const transparentToken = ${safeTransparentToken};

    function setStatus(elementId, message, type) {
      const element = document.getElementById(elementId);
      element.textContent = message;
      element.className = 'status ' + (type || '');
    }

    function loadScript(src) {
      return new Promise(function(resolve, reject) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    async function bootstrap() {
      try {
        await loadScript(sdkUrl);

        if (!window.CheckoutTransparent) {
          throw new Error('Objeto CheckoutTransparent não encontrado após carregar SDK.');
        }

        CheckoutTransparent.setCredentials({
          merchantCredential,
          transparentToken
        });

        setStatus(
          'sdkStatus',
          'SDK carregado e credenciais registradas com sucesso.',
          'success'
        );
      } catch (error) {
        setStatus(
          'sdkStatus',
          'Erro ao inicializar SDK PicPay: ' + String(error.message || error),
          'error'
        );
      }
    }

    function getCardBrand() {
      try {
        const bin = document
          .getElementById('cardNumber')
          .value
          .replace(/\\D/g, '')
          .slice(0, 6);

        if (bin.length < 6) {
          throw new Error('Informe pelo menos os 6 primeiros dígitos do cartão.');
        }

        CheckoutTransparent.getCardBrand({
          bin,
          success: function(body) {
            if (body && body.brand) {
              document.getElementById('brand').value = body.brand;
            }

            setStatus(
              'tokenStatus',
              'Bandeira retornada: ' + JSON.stringify(body, null, 2),
              'success'
            );
          },
          error: function(body) {
            setStatus(
              'tokenStatus',
              'Erro ao obter bandeira: ' + JSON.stringify(body, null, 2),
              'error'
            );
          }
        });
      } catch (error) {
        setStatus(
          'tokenStatus',
          'Erro ao obter bandeira: ' + String(error.message || error),
          'error'
        );
      }
    }

    function createTemporaryCard() {
      document.getElementById('temporaryCardToken').value = '';
      document.getElementById('processRecurringBody').value = '';

      try {
        const card = {
          brand: document.getElementById('brand').value.trim(),
          number: document.getElementById('cardNumber').value.replace(/\\D/g, ''),
          holderName: document.getElementById('holderName').value.trim(),
          holderDocument: document
            .getElementById('holderDocument')
            .value
            .replace(/\\D/g, ''),
          expirationMonth: document
            .getElementById('expirationMonth')
            .value
            .replace(/\\D/g, ''),
          expirationYear: document
            .getElementById('expirationYear')
            .value
            .replace(/\\D/g, ''),
          cvv: document.getElementById('cvv').value.replace(/\\D/g, '')
        };

        CheckoutTransparent.createTemporaryCard({
          card,
          success: function(body) {
            const token =
              body.temporaryToken ||
              body.temporaryCardToken ||
              body.token ||
              '';

            if (!token) {
              setStatus(
                'tokenStatus',
                'SDK retornou sucesso, mas sem token: ' + JSON.stringify(body, null, 2),
                'error'
              );
              return;
            }

            document.getElementById('temporaryCardToken').value = token;

            setStatus(
              'tokenStatus',
              'temporaryCardToken gerado com sucesso:\\n' + JSON.stringify(body, null, 2),
              'success'
            );

            buildProcessRecurringBody();
          },
          error: function(body) {
            setStatus(
              'tokenStatus',
              'Erro ao gerar temporaryCardToken:\\n' + JSON.stringify(body, null, 2),
              'error'
            );
          }
        });
      } catch (error) {
        setStatus(
          'tokenStatus',
          'Erro ao gerar temporaryCardToken: ' + String(error.message || error),
          'error'
        );
      }
    }

    function buildProcessRecurringBody() {
      const checkoutSessionId = document
        .getElementById('checkoutSessionId')
        .value
        .trim();

      const temporaryCardToken = document
        .getElementById('temporaryCardToken')
        .value
        .trim();

      const holderName = document.getElementById('holderName').value.trim();
      const holderDocument = document
        .getElementById('holderDocument')
        .value
        .replace(/\\D/g, '');

      const body = {
        checkoutSessionId,
        paymentMethod: 'credit_card',
        gatewayProvider: 'picpay',
        payer: {
          name: holderName,
          email: 'cliente.picpay.card@siplug.com',
          documentType: 'CPF',
          documentValue: holderDocument,
          phone: {
            countryCode: '55',
            areaCode: '11',
            number: '999999999',
            type: 'MOBILE'
          }
        },
        paymentData: {
          method: 'credit_card',
          temporaryCardToken,
          cardholderName: holderName,
          cardholderDocument: holderDocument,
          brand: document.getElementById('brand').value.trim()
        },
        metadata: {
          source: 'dev-picpay-temporary-card-token-page',
          origin: 'picpay-recurring-credit-card-test'
        },
        config: {
          capture: true
        }
      };

      document.getElementById('processRecurringBody').value =
        JSON.stringify(body, null, 2);
    }

    async function copyTemporaryCardToken() {
      const token = document.getElementById('temporaryCardToken').value;

      if (!token) {
        alert('Nenhum temporaryCardToken gerado.');
        return;
      }

      await navigator.clipboard.writeText(token);
      alert('temporaryCardToken copiado.');
    }

    async function copyProcessRecurringBody() {
      const body = document.getElementById('processRecurringBody').value;

      if (!body) {
        alert('Nenhum body gerado.');
        return;
      }

      await navigator.clipboard.writeText(body);
      alert('Body copiado.');
    }

    bootstrap();
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