import { Controller, Get, Header, Query } from '@nestjs/common';

@Controller('dev/mercado-pago')
export class DevMercadoPagoCardTokenPageController {
  @Get('card-token-page')
  @Header('Content-Type', 'text/html; charset=utf-8')
  handle(
    @Query('publicKey') publicKey?: string,
    @Query('amount') amount?: string,
    @Query('checkoutSessionId') checkoutSessionId?: string,
  ): string {
    const safePublicKey = this.escapeHtml(publicKey ?? '');
    const safeAmount = this.escapeHtml(amount ?? '10.00');
    const safeCheckoutSessionId = this.escapeHtml(checkoutSessionId ?? '');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Dev Mercado Pago Card Token - SiPlug</title>
  <script src="https://sdk.mercadopago.com/js/v2"></script>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: Arial, sans-serif;
      background: #121212;
      color: #f5f5f5;
    }

    .page {
      max-width: 980px;
      margin: 0 auto;
    }

    .card {
      background: #1f1f1f;
      border: 1px solid #333;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 24px;
    }

    h1, h2 {
      margin-top: 0;
    }

    label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      color: #cfcfcf;
    }

    input,
    select,
    textarea {
      width: 100%;
      min-height: 42px;
      padding: 10px;
      margin-bottom: 16px;
      border-radius: 8px;
      border: 1px solid #444;
      background: #0f0f0f;
      color: #f5f5f5;
      font-size: 14px;
    }

    textarea {
      min-height: 240px;
      font-family: monospace;
    }

    .container {
      min-height: 42px;
      padding: 10px;
      margin-bottom: 16px;
      border-radius: 8px;
      border: 1px solid #444;
      background: #0f0f0f;
    }

    button {
      border: 0;
      border-radius: 8px;
      padding: 12px 18px;
      background: #72f863;
      color: #121212;
      font-weight: bold;
      cursor: pointer;
      margin-right: 8px;
      margin-bottom: 8px;
    }

    button.secondary {
      background: #008ce3;
      color: #fff;
    }

    button.danger {
      background: #ff5c5c;
      color: #fff;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .status {
      padding: 12px;
      border-radius: 8px;
      background: #0f0f0f;
      border: 1px solid #333;
      margin-top: 12px;
      white-space: pre-wrap;
      font-family: monospace;
    }

    .success {
      border-color: #72f863;
      color: #72f863;
    }

    .error {
      border-color: #ff5c5c;
      color: #ff5c5c;
    }

    .info {
      color: #9fd7ff;
      font-size: 14px;
      line-height: 1.5;
    }

    progress {
      width: 100%;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      body {
        padding: 16px;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>
  <div class="page">
    <div class="card">
      <h1>Gerador Dev de CardToken Mercado Pago</h1>

      <p class="info">
        Use esta tela apenas em ambiente local/dev. O cartão é tokenizado pelo MercadoPago.js no navegador.
        A API da SiPlug deve receber apenas o token gerado, nunca os dados crus do cartão.
      </p>
    </div>

    <div class="card">
      <h2>Configuração</h2>

      <label for="publicKey">Public Key Mercado Pago</label>
      <input
        id="publicKey"
        value="${safePublicKey}"
        placeholder="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      />

      <div class="grid">
        <div>
          <label for="amount">Valor para tokenização/teste</label>
          <input id="amount" value="${safeAmount}" placeholder="10.00" />
        </div>

        <div>
          <label for="checkoutSessionId">Checkout Session ID recorrente</label>
          <input
            id="checkoutSessionId"
            value="${safeCheckoutSessionId}"
            placeholder="UUID_DA_CHECKOUT_SESSION"
          />
        </div>
      </div>

      <button type="button" onclick="initializeCardForm()">
        Inicializar MercadoPago.js
      </button>

      <button type="button" class="secondary" onclick="fillTestHelper()">
        Preencher dados auxiliares de teste
      </button>

      <div id="initStatus" class="status">Aguardando inicialização...</div>
    </div>

    <div class="card">
      <h2>Cartão</h2>

      <form id="form-checkout">
        <label>Número do cartão</label>
        <div id="form-checkout__cardNumber" class="container"></div>

        <div class="grid">
          <div>
            <label>Validade</label>
            <div id="form-checkout__expirationDate" class="container"></div>
          </div>

          <div>
            <label>CVV</label>
            <div id="form-checkout__securityCode" class="container"></div>
          </div>
        </div>

        <label for="form-checkout__cardholderName">Nome impresso no cartão</label>
        <input type="text" id="form-checkout__cardholderName" placeholder="APRO" />

        <div class="grid">
          <div>
            <label for="form-checkout__issuer">Banco emissor</label>
            <select id="form-checkout__issuer"></select>
          </div>

          <div>
            <label for="form-checkout__installments">Parcelas</label>
            <select id="form-checkout__installments"></select>
          </div>
        </div>

        <div class="grid">
          <div>
            <label for="form-checkout__identificationType">Tipo de documento</label>
            <select id="form-checkout__identificationType"></select>
          </div>

          <div>
            <label for="form-checkout__identificationNumber">Documento</label>
            <input
              type="text"
              id="form-checkout__identificationNumber"
              placeholder="12345678909"
            />
          </div>
        </div>

        <label for="form-checkout__cardholderEmail">E-mail do pagador</label>
        <input
          type="email"
          id="form-checkout__cardholderEmail"
          placeholder="cliente.recorrente.card@siplug.com"
        />

        <progress value="0" class="progress-bar">Carregando...</progress>

        <button type="submit">
          Gerar CardToken
        </button>
      </form>

      <div id="tokenStatus" class="status">Token ainda não gerado.</div>
    </div>

    <div class="card">
      <h2>CardToken gerado</h2>

      <label for="cardTokenId">cardTokenId</label>
      <input id="cardTokenId" readonly />

      <button type="button" onclick="copyCardToken()">
        Copiar cardTokenId
      </button>
    </div>

    <div class="card">
      <h2>Body para testar /payments/process-recurring</h2>

      <textarea id="processRecurringBody" readonly></textarea>

      <button type="button" onclick="copyProcessRecurringBody()">
        Copiar body
      </button>
    </div>
  </div>

  <script>
    let cardForm = null;

    function setStatus(elementId, message, type) {
      const element = document.getElementById(elementId);
      element.textContent = message;
      element.className = 'status ' + (type || '');
    }

    function fillTestHelper() {
      document.getElementById('form-checkout__cardholderName').value = 'APRO';
      document.getElementById('form-checkout__identificationNumber').value = '12345678909';
      document.getElementById('form-checkout__cardholderEmail').value = 'cliente.recorrente.card@siplug.com';

      setStatus(
        'initStatus',
        'Dados auxiliares preenchidos. Agora preencha número, validade e CVV nos campos seguros do Mercado Pago.',
        'success'
      );
    }

    function initializeCardForm() {
      try {
        const publicKey = document.getElementById('publicKey').value.trim();
        const amount = document.getElementById('amount').value.trim() || '10.00';

        if (!publicKey) {
          throw new Error('Public Key é obrigatória.');
        }

        const mp = new MercadoPago(publicKey, {
          locale: 'pt-BR'
        });

        cardForm = mp.cardForm({
          amount,
          iframe: true,
          form: {
            id: 'form-checkout',

            cardNumber: {
              id: 'form-checkout__cardNumber',
              placeholder: 'Número do cartão'
            },

            expirationDate: {
              id: 'form-checkout__expirationDate',
              placeholder: 'MM/YY'
            },

            securityCode: {
              id: 'form-checkout__securityCode',
              placeholder: 'CVV'
            },

            cardholderName: {
              id: 'form-checkout__cardholderName',
              placeholder: 'Titular do cartão'
            },

            issuer: {
              id: 'form-checkout__issuer',
              placeholder: 'Banco emissor'
            },

            installments: {
              id: 'form-checkout__installments',
              placeholder: 'Parcelas'
            },

            identificationType: {
              id: 'form-checkout__identificationType',
              placeholder: 'Tipo de documento'
            },

            identificationNumber: {
              id: 'form-checkout__identificationNumber',
              placeholder: 'Número do documento'
            },

            cardholderEmail: {
              id: 'form-checkout__cardholderEmail',
              placeholder: 'E-mail'
            }
          },

          callbacks: {
            onFormMounted: function(error) {
              if (error) {
                setStatus(
                  'initStatus',
                  'Erro ao montar CardForm: ' + JSON.stringify(error, null, 2),
                  'error'
                );
                return;
              }

              setStatus(
                'initStatus',
                'CardForm inicializado com sucesso. Preencha o cartão e clique em Gerar CardToken.',
                'success'
              );
            },

            onSubmit: function(event) {
              event.preventDefault();

              try {
                const data = cardForm.getCardFormData();

                if (!data.token) {
                  throw new Error('Mercado Pago não retornou token. Confira os dados do cartão.');
                }

                document.getElementById('cardTokenId').value = data.token;

                const body = buildProcessRecurringBody(data);
                document.getElementById('processRecurringBody').value =
                  JSON.stringify(body, null, 2);

                setStatus(
                  'tokenStatus',
                  'CardToken gerado com sucesso. Use o cardTokenId no campo paymentData.cardTokenId.',
                  'success'
                );
              } catch (error) {
                setStatus(
                  'tokenStatus',
                  'Erro ao gerar token: ' + String(error.message || error),
                  'error'
                );
              }
            },

            onFetching: function(resource) {
              const progressBar = document.querySelector('.progress-bar');
              progressBar.removeAttribute('value');

              return function() {
                progressBar.setAttribute('value', '0');
              };
            }
          }
        });
      } catch (error) {
        setStatus(
          'initStatus',
          'Erro na inicialização: ' + String(error.message || error),
          'error'
        );
      }
    }

    function buildProcessRecurringBody(cardFormData) {
      const checkoutSessionId = document
        .getElementById('checkoutSessionId')
        .value
        .trim();

      return {
        checkoutSessionId,
        paymentMethod: 'credit_card',
        gatewayProvider: 'mercadopago',

        payer: {
          name: document.getElementById('form-checkout__cardholderName').value,
          email: cardFormData.cardholderEmail,
          documentType: cardFormData.identificationType,
          documentValue: cardFormData.identificationNumber
        },

        paymentData: {
          method: 'credit_card',
          cardTokenId: cardFormData.token,
          paymentMethodId: cardFormData.paymentMethodId || null,
          issuerId: cardFormData.issuerId || null,
          installments: Number(cardFormData.installments || 1)
        },

        metadata: {
          source: 'dev-mercado-pago-card-token-page',
          origin: 'recurring-credit-card-test'
        },

        config: {
          capture: true
        }
      };
    }

    async function copyCardToken() {
      const value = document.getElementById('cardTokenId').value;

      if (!value) {
        alert('Nenhum token gerado ainda.');
        return;
      }

      await navigator.clipboard.writeText(value);
      alert('cardTokenId copiado.');
    }

    async function copyProcessRecurringBody() {
      const value = document.getElementById('processRecurringBody').value;

      if (!value) {
        alert('Nenhum body gerado ainda.');
        return;
      }

      await navigator.clipboard.writeText(value);
      alert('Body copiado.');
    }

    window.addEventListener('load', function() {
      const publicKey = document.getElementById('publicKey').value.trim();

      if (publicKey) {
        initializeCardForm();
      }
    });
  </script>
</body>
</html>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}