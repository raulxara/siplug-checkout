import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infra/database/prisma/prisma.service';

/* supertest exposes response.body as any; assertions below validate its runtime shape. */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

describe('Full application flow (steps 1 to 4)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const runId = randomUUID();
  const tag = `e2e-${runId}`;
  const adminToken = `token-${runId}`;
  const mercadoPagoAccessToken =
    'TEST-6395065273942617-052714-0b1b10e004ab0843f6cf5fee5cf48f76-494786624';
  const mercadoPagoWebhookSecret =
    '80c9612f933bd46c8690813f7ee28755767b5ccbaf26213975854db1602c2817';
  const mercadoPagoPublicKey = 'TEST-95c199d0-0303-41a6-a9cf-7e7590771460';
  const mercadoPagoNotificationUrl =
    'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/mercado-pago/58f0a86c-4b1a-4e33-88ef-30bcf794a9ad?source_news=webhooks';
  const mercadoPagoTestPayerEmail = 'raul.nascc98@gmail.com';

  let officeId: string;
  let adminProfileId: string;
  let adminClientId: string;
  let adminUserId: string;
  let administratorPositionId: string;
  let gatewayId: string;
  let apiCredentialId: string;
  let infinitePayGatewayId: string;
  let infinitePayApiCredentialId: string;
  let stripeGatewayId: string;
  let stripeApiCredentialId: string;
  let pagSeguroGatewayId: string;
  let pagSeguroApiCredentialId: string;
  let permissionId: string;
  let positionId: string;
  let userId: string;
  let userProfileId: string;
  let userClientId: string;
  let paymentCustomerId: string;

  const api = () => {
    const client = request(app.getHttpServer());

    return {
      post: (url: string) =>
        client.post(url).set('authorization', `Bearer ${adminToken}`),
      put: (url: string) =>
        client.put(url).set('authorization', `Bearer ${adminToken}`),
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    officeId = randomUUID();
    administratorPositionId = randomUUID();
    adminProfileId = randomUUID();
    adminClientId = randomUUID();
    adminUserId = randomUUID();

    await prisma.office.create({
      data: {
        unique_id: officeId,
        name: 'Teste App',
        slug: 'teste-app',
        language: 'pt-BR',
        currency: 'BRL',
        address_street: 'Rua Barra Mansa',
        address_number: '151',
        address_complement: 'Sala 101',
        address_neighborhood: 'Centro',
        address_city: 'São Paulo',
        address_state: 'SP',
        address_country: 'BRL',
        status: 'active',
      },
    });

    await prisma.position.create({
      data: {
        unique_id: administratorPositionId,
        office_id: officeId,
        name: 'Administrator',
        slug: 'administrator',
        description: 'Cliente Administrator',
        status: 'active',
      },
    });

    await prisma.profile.create({
      data: {
        unique_id: adminProfileId,
        first_name: 'Teste',
        last_name: 'Cliente Administrator',
        email: `admin-${runId}@example.test`,
        phone: '11965889207',
        document_type: 'cpf',
        document_value: '46133628812',
        address_street: 'Rua Barra Mansa',
        address_number: '151',
        address_complement: 'Sala 101',
        address_neighborhood: 'Centro',
        address_city: 'São Paulo',
        address_state: 'SP',
        address_country: 'BRL',
        status: 'active',
      },
    });

    await prisma.client.create({
      data: {
        unique_id: adminClientId,
        office_id: officeId,
        user_type: 'customer',
        username: `admin-${runId}@example.test`,
        password: 'not-used-by-e2e',
        status: 'active',
      },
    });

    await prisma.userCustomer.create({
      data: {
        unique_id: adminUserId,
        client_id: adminClientId,
        profile_id: adminProfileId,
        token: adminToken,
        two_fa_required: false,
        two_fa_active: false,
        status: 'active',
      },
    });

    await prisma.userPosition.create({
      data: {
        unique_id: randomUUID(),
        user_customer_id: adminUserId,
        position_id: administratorPositionId,
        status: 'active',
      },
    });
  });

  it('creates and verifies the base, Mercado Pago and access-management flow', async () => {
    const gatewayResponse = await api()
      .post('/api/v1/gateways/register')
      .send({
        name: 'Mercado Pago',
        slug: `mercado-pago-${runId}`,
        provider: 'mercado_pago',
        config: {
          baseUrl: 'https://api.mercadopago.com',
          priority: 1,
          provider: 'mercado_pago',
          isDefault: true,
          environment: 'sandbox',
          paymentTypes: ['one_time', 'recurring'],
          paymentMethods: ['pix', 'credit_card', 'boleto', 'payment_link'],
          supportedPaymentMethods: [
            'pix',
            'credit_card',
            'boleto',
            'payment_link',
          ],
          supportsInstallments: false,
          supportsSplitPayment: false,
          supportsOneTimePayment: true,
          supportsRecurringPayment: true,
          testRun: tag,
        },
      })
      .expect(201);

    expect(gatewayResponse.body.status).toBe('success');
    gatewayId = gatewayResponse.body.data._id;
    expect(gatewayId).toEqual(expect.any(String));

    const updatedGatewayResponse = await api()
      .put('/api/v1/gateways/update')
      .send({ gatewayId, description: `Mercado Pago test gateway ${tag}` })
      .expect(200);
    expect(updatedGatewayResponse.body.data.gateway.description).toBe(
      `Mercado Pago test gateway ${tag}`,
    );

    const gatewaysResponse = await api()
      .post('/api/v1/gateways/get-all')
      .send({})
      .expect(200);
    expect(gatewaysResponse.body.data.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: gatewayId })]),
    );

    const credentialResponse = await api()
      .post('/api/v1/api-credentials/register')
      .send({
        officeId,
        gatewayId,
        name: 'Mercado Pago',
        slug: 'mercado-pago',
        provider: 'mercado_pago',
        providerType: 'gateway_provider',
        providerToken: mercadoPagoAccessToken,
        environment: 'local',
        config: {
          baseUrl: 'https://api.mercadopago.com',
          priority: 1,
          provider: 'mercado_pago',
          isDefault: true,
          publicKey: mercadoPagoPublicKey,
          environment: 'sandbox',
          paymentTypes: ['one_time', 'recurring'],
          recurringFlow: 'approval_url',
          recurringMode: 'gateway_native',
          webhookSecret: mercadoPagoWebhookSecret,
          paymentMethods: ['pix', 'credit_card', 'boleto', 'payment_link'],
          notificationUrl: mercadoPagoNotificationUrl,
          supportsInstallments: false,
          supportsSplitPayment: false,
          supportsOneTimePayment: true,
          supportsRecurringPayment: true,
          supportedPaymentMethods: [
            'pix',
            'credit_card',
            'boleto',
            'payment_link',
          ],
          testRun: tag,
        },
      })
      .expect(201);

    apiCredentialId = credentialResponse.body.data._id;
    expect(apiCredentialId).toEqual(expect.any(String));

    const storedCredential = await prisma.apiCredential.findUniqueOrThrow({
      where: { unique_id: apiCredentialId },
    });
    expect(storedCredential.token).toMatch(/^enc::/);
    expect(storedCredential.config).toEqual(
      expect.objectContaining({
        webhookSecret: expect.stringMatching(/^enc::/),
      }),
    );

    const credentialByIdResponse = await api()
      .post('/api/v1/api-credentials/get-by-unique-id')
      .send({ apiCredentialId })
      .expect(200);
    expect(credentialByIdResponse.body.data.apiCredential._id).toBe(
      apiCredentialId,
    );

    const credentialsResponse = await api()
      .post('/api/v1/api-credentials/list-by-office-id')
      .send({ officeId })
      .expect(200);
    expect(credentialsResponse.body.data.apiCredentials).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: apiCredentialId }),
      ]),
    );

    const permissionResponse = await api()
      .post('/api/v1/permissions/register')
      .send({
        officeId,
        name: `Read own user ${tag}`,
        slug: `read-own-user-${runId}`,
        entity: 'user_customers',
        action: 'readOwnUser',
      })
      .expect(201);
    permissionId = permissionResponse.body.data._id;

    const updatedPermissionResponse = await api()
      .post('/api/v1/permissions/update-by-unique-id')
      .send({
        permissionId,
        officeId,
        description: `Updated by ${tag}`,
      })
      .expect(200);
    expect(updatedPermissionResponse.body.data.permission.description).toBe(
      `Updated by ${tag}`,
    );

    const permissionByIdResponse = await api()
      .post('/api/v1/permissions/get-by-unique-id')
      .send({ permissionId })
      .expect(200);
    expect(permissionByIdResponse.body.data.permission._id).toBe(permissionId);

    const permissionsResponse = await api()
      .post('/api/v1/permissions/list-by-office-id')
      .send({ officeId })
      .expect(200);
    expect(permissionsResponse.body.data.permissions).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: permissionId })]),
    );

    const positionResponse = await api()
      .post('/api/v1/positions/register')
      .send({
        officeId,
        name: `Customer ${tag}`,
        slug: `customer-${runId}`,
        description: 'Position used only by the E2E flow',
      })
      .expect(201);
    positionId = positionResponse.body.data._id;
    const customerPositionSlug = `customer-updated-${runId}`;

    const updatedPositionResponse = await api()
      .post('/api/v1/positions/update-by-unique-id')
      .send({ positionId, officeId, slug: customerPositionSlug })
      .expect(200);
    expect(updatedPositionResponse.body.data.position.slug).toBe(
      customerPositionSlug,
    );

    const positionByIdResponse = await api()
      .post('/api/v1/positions/get-by-unique-id')
      .send({ positionId })
      .expect(200);
    expect(positionByIdResponse.body.data.position._id).toBe(positionId);

    const positionsResponse = await api()
      .post('/api/v1/positions/list-by-office-id')
      .send({ officeId })
      .expect(200);
    expect(positionsResponse.body.data.positions).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: positionId })]),
    );

    const syncResponse = await api()
      .post('/api/v1/position-permissions/sync')
      .send({ positionId, permissionIds: [permissionId] })
      .expect(201);
    expect(syncResponse.body.data.totalCreated).toBe(1);

    const userResponse = await api()
      .post('/api/v1/users/register')
      .send({
        officeId,
        positionSlug: customerPositionSlug,
        firstName: 'E2E',
        lastName: 'User',
        email: `user-${runId}@example.test`,
        username: `user-${runId}`,
        password: 'safe-test-password',
        userType: 'customer',
      })
      .expect(201);

    userId = userResponse.body.data.userCustomer._id;
    userProfileId = userResponse.body.data.profile._id;
    userClientId = userResponse.body.data.client._id;
    expect(userResponse.body.data.userPosition.positionId).toBe(positionId);

    const updatedUserResponse = await api()
      .put('/api/v1/users/update')
      .send({ userCustomerId: userId, firstName: 'E2E Updated' })
      .expect(200);
    expect(updatedUserResponse.body.data.profile.firstName).toBe('E2E Updated');

    const userByIdResponse = await api()
      .post('/api/v1/users/get')
      .send({ userCustomerId: userId })
      .expect(200);
    expect(userByIdResponse.body.data.userCustomer._id).toBe(userId);
    expect(userByIdResponse.body.data.profile.firstName).toBe('E2E Updated');

    const usersResponse = await api()
      .post('/api/v1/users/list')
      .send({ officeId, search: `user-${runId}` })
      .expect(200);
    expect(usersResponse.body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userCustomer: expect.objectContaining({ _id: userId }),
        }),
      ]),
    );

    const officeUsersResponse = await api()
      .post('/api/v1/users/get-all-by-office-id')
      .send({ officeId })
      .expect(200);
    expect(officeUsersResponse.body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userCustomer: expect.objectContaining({ _id: userId }),
        }),
      ]),
    );

    const positionPermission = await prisma.positionPermission.findUnique({
      where: {
        position_id_permission_id: {
          position_id: positionId,
          permission_id: permissionId,
        },
      },
    });
    expect(positionPermission).toEqual(
      expect.objectContaining({ status: 'active' }),
    );

    const payer = {
      name: 'Buyer Test User',
      email: mercadoPagoTestPayerEmail,
      documentType: 'cpf',
      documentValue: '12345678909',
      address: {
        zipCode: '06233200',
        streetName: 'Av. das Nações Unidas',
        streetNumber: '3003',
        neighborhood: 'Bonfim',
        city: 'Osasco',
        federalUnit: 'SP',
      },
    };

    const paymentCustomerResponse = await api()
      .post('/api/v1/payment-customers/register')
      .send({
        officeId,
        clientId: userClientId,
        profileId: userProfileId,
        externalReference: `payer-${runId}`,
        name: payer.name,
        email: payer.email,
        documentType: payer.documentType,
        documentValue: payer.documentValue,
        billingAddress: payer.address,
        metadata: { source: 'e2e', gatewayProvider: 'mercado_pago' },
        config: { environment: 'sandbox' },
      })
      .expect(201);

    paymentCustomerId = paymentCustomerResponse.body.data._id;
    expect(paymentCustomerResponse.body.data).toEqual(
      expect.objectContaining({
        _id: paymentCustomerId,
        officeId,
        clientId: userClientId,
        profileId: userProfileId,
        name: payer.name,
        email: payer.email,
        documentType: payer.documentType,
        documentValue: payer.documentValue,
        billingAddress: expect.objectContaining(payer.address),
        status: 'active',
      }),
    );

    const paymentCustomerByIdResponse = await api()
      .post('/api/v1/payment-customers/get-by-unique-id')
      .send({ paymentCustomerId })
      .expect(200);
    expect(paymentCustomerByIdResponse.body.data.paymentCustomer).toEqual(
      expect.objectContaining({ _id: paymentCustomerId }),
    );

    const paymentMethods = ['pix', 'payment_link', 'credit_card', 'boleto'];
    const checkoutSessionIds = new Map<string, string>();

    for (const paymentMethod of paymentMethods) {
      const checkoutSessionResponse = await api()
        .post('/api/v1/checkout-sessions/register')
        .send({
          officeId,
          clientId: userClientId,
          paymentCustomerId,
          gatewayId,
          apiCredentialId,
          code: `checkout-${paymentMethod}-${runId}`,
          externalReference: `checkout-${paymentMethod}-${runId}`,
          idempotencyKey: `checkout-${paymentMethod}-${runId}`,
          paymentType: 'one_time',
          amount: 1000,
          currency: 'BRL',
          description: `Mercado Pago one-time ${paymentMethod} checkout`,
          successUrl: 'https://checkout.example.test/success',
          cancelUrl: 'https://checkout.example.test/cancel',
          items: [
            {
              itemRef: `item-${paymentMethod}-${runId}`,
              itemType: 'product',
              name: `E2E ${paymentMethod} item`,
              quantity: 1,
              unitAmount: 1000,
              totalAmount: 1000,
            },
          ],
          metadata: { paymentMethod, testRun: tag },
          config: { paymentMethod },
        })
        .expect(201);

      const checkoutSession = checkoutSessionResponse.body.data.checkoutSession;
      expect(checkoutSession).toEqual(
        expect.objectContaining({
          officeId,
          clientId: userClientId,
          paymentCustomerId,
          gatewayId,
          apiCredentialId,
          paymentType: 'one_time',
          amount: 1000,
          currency: 'BRL',
          status: 'created',
        }),
      );
      expect(checkoutSession.metadata).toEqual(
        expect.objectContaining({
          paymentMethod,
          gatewayProvider: 'mercado_pago',
        }),
      );
      expect(checkoutSessionResponse.body.data.items).toEqual([
        expect.objectContaining({
          quantity: 1,
          unitAmount: 1000,
          totalAmount: 1000,
        }),
      ]);

      const checkoutSessionId = asString(checkoutSession._id);
      checkoutSessionIds.set(paymentMethod, checkoutSessionId);

      const checkoutSessionByIdResponse = await api()
        .post('/api/v1/checkout-sessions/get-by-unique-id')
        .send({ checkoutSessionId })
        .expect(200);
      expect(checkoutSessionByIdResponse.body.data.checkoutSession._id).toBe(
        checkoutSessionId,
      );
    }

    expect([...checkoutSessionIds.keys()]).toEqual(paymentMethods);

    const checkoutSessionsResponse = await api()
      .post('/api/v1/checkout-sessions/list')
      .send({ officeId, search: runId })
      .expect(200);
    expect(checkoutSessionsResponse.body.data.items).toEqual(
      expect.arrayContaining(
        [...checkoutSessionIds.values()].map((checkoutSessionId) =>
          expect.objectContaining({
            checkoutSession: expect.objectContaining({
              _id: checkoutSessionId,
            }),
          }),
        ),
      ),
    );

    const checkoutSessionsByOfficeResponse = await api()
      .post('/api/v1/checkout-sessions/list-by-office-id')
      .send({ officeId })
      .expect(200);
    expect(checkoutSessionsByOfficeResponse.body.data.checkoutSessions).toEqual(
      expect.arrayContaining(
        [...checkoutSessionIds.values()].map((checkoutSessionId) =>
          expect.objectContaining({ _id: checkoutSessionId }),
        ),
      ),
    );

    const pixCheckoutSessionId = asString(checkoutSessionIds.get('pix'));
    const pixPaymentResponse = await api()
      .post('/api/v1/payments/process')
      .send({
        checkoutSessionId: pixCheckoutSessionId,
        paymentMethod: 'pix',
        externalReference: `checkout-mercadopago-pix-${runId}`,
        idempotencyKey: `checkout-mercadopago-pix-${runId}`,
        payer,
        paymentData: { method: 'pix' },
        metadata: {
          source: 'e2e',
          origin: 'mercadopago-pix-one-time-test',
        },
        config: { capture: true, environment: 'sandbox' },
      })
      .expect(200);

    const pixTransaction = pixPaymentResponse.body.data.paymentTransaction;
    expect(pixTransaction).toEqual(
      expect.objectContaining({
        checkoutSessionId: pixCheckoutSessionId,
        paymentCustomerId,
        gatewayId,
        apiCredentialId,
        paymentMethod: 'pix',
        gatewayTransactionId: expect.any(String),
        qrCode: expect.any(String),
        gatewayResponse: expect.objectContaining({
          endpoint: '/v1/payments',
          ok: true,
        }),
      }),
    );

    const paymentLinkCheckoutSessionId = asString(
      checkoutSessionIds.get('payment_link'),
    );
    const paymentLinkResponse = await api()
      .post('/api/v1/payments/process')
      .send({
        checkoutSessionId: paymentLinkCheckoutSessionId,
        paymentMethod: 'payment_link',
        externalReference: `checkout-mercadopago-link-${runId}`,
        idempotencyKey: `checkout-mercadopago-link-${runId}`,
        payer,
        paymentData: { method: 'payment_link' },
        metadata: { source: 'e2e', origin: 'mercadopago-link-one-time-test' },
        config: { capture: true, environment: 'sandbox' },
      })
      .expect(200);

    const paymentLinkTransaction =
      paymentLinkResponse.body.data.paymentTransaction;
    expect(paymentLinkTransaction).toEqual(
      expect.objectContaining({
        checkoutSessionId: paymentLinkCheckoutSessionId,
        paymentCustomerId,
        gatewayId,
        apiCredentialId,
        paymentMethod: 'payment_link',
        gatewayTransactionId: expect.any(String),
        checkoutUrl: expect.any(String),
        gatewayResponse: expect.objectContaining({
          endpoint: '/checkout/preferences',
          ok: true,
        }),
      }),
    );

    const infinitePayGatewayResponse = await api()
      .post('/api/v1/gateways/register')
      .send({
        name: 'InfinitePay',
        slug: `infinitepay-${runId}`,
        provider: 'infinitepay',
        config: {
          handle: 'raul-nascimento-007',
          priority: 2,
          provider: 'infinitepay',
          isDefault: true,
          webhookUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/infinitepay',
          environment: 'sandbox',
          paymentFlow: 'hosted_checkout',
          redirectUrl: 'https://siplug.com/payment/success',
          paymentTypes: ['one_time', 'recurring'],
          recurringMode: 'gateway_native',
          paymentMethods: ['payment_link', 'pix', 'credit_card'],
          supportsInstallments: true,
          supportsSplitPayment: false,
          supportsOneTimePayment: true,
          supportedPaymentMethods: ['payment_link', 'pix', 'credit_card'],
          supportsRecurringPayment: true,
          testRun: tag,
        },
      })
      .expect(201);
    infinitePayGatewayId = infinitePayGatewayResponse.body.data._id;

    const infinitePayCredentialResponse = await api()
      .post('/api/v1/api-credentials/register')
      .send({
        officeId,
        gatewayId: infinitePayGatewayId,
        name: 'InfinitePay',
        slug: 'infinitepay',
        provider: 'infinitepay',
        providerType: 'gateway_provider',
        providerToken:
          'APP_USR-4985143340013564-052714-90b535818da26bcceb0011fcc4a0fd7a-3431138232',
        environment: 'local',
        config: {
          handle: 'raul-nascimento-007',
          priority: 2,
          provider: 'infinitepay',
          isDefault: true,
          webhookUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/infinitepay',
          environment: 'sandbox',
          paymentFlow: 'hosted_checkout',
          redirectUrl: 'https://siplug.com/payment/success',
          paymentTypes: ['one_time', 'recurring'],
          recurringMode: 'gateway_native',
          paymentMethods: ['payment_link', 'pix', 'credit_card'],
          supportsInstallments: true,
          supportsSplitPayment: false,
          supportsOneTimePayment: true,
          supportedPaymentMethods: ['payment_link', 'pix', 'credit_card'],
          supportsRecurringPayment: true,
          testRun: tag,
        },
      })
      .expect(201);
    infinitePayApiCredentialId = infinitePayCredentialResponse.body.data._id;

    const infinitePayCheckoutSessionResponse = await api()
      .post('/api/v1/checkout-sessions/register')
      .send({
        officeId,
        clientId: userClientId,
        paymentCustomerId,
        gatewayId: infinitePayGatewayId,
        apiCredentialId: infinitePayApiCredentialId,
        code: `infinitepay-payment-link-${runId}`,
        externalReference: `infinitepay-payment-link-${runId}`,
        idempotencyKey: `infinitepay-payment-link-${runId}`,
        paymentType: 'one_time',
        amount: 1000,
        currency: 'BRL',
        description: 'InfinitePay one-time payment link checkout',
        successUrl: 'https://siplug.com/payment/success',
        cancelUrl: 'https://siplug.com/payment/cancel',
        items: [
          {
            itemRef: `infinitepay-item-${runId}`,
            itemType: 'product',
            name: 'InfinitePay E2E item',
            quantity: 1,
            unitAmount: 1000,
            totalAmount: 1000,
          },
        ],
        metadata: { paymentMethod: 'payment_link', testRun: tag },
        config: { paymentMethod: 'payment_link', environment: 'sandbox' },
      })
      .expect(201);

    const infinitePayCheckoutSessionId = asString(
      infinitePayCheckoutSessionResponse.body.data.checkoutSession._id,
    );
    expect(
      infinitePayCheckoutSessionResponse.body.data.checkoutSession,
    ).toEqual(
      expect.objectContaining({
        paymentCustomerId,
        gatewayId: infinitePayGatewayId,
        apiCredentialId: infinitePayApiCredentialId,
        paymentType: 'one_time',
      }),
    );

    const infinitePayPaymentResponse = await api()
      .post('/api/v1/payments/process')
      .send({
        checkoutSessionId: infinitePayCheckoutSessionId,
        paymentMethod: 'payment_link',
        externalReference: `infinitepay-payment-link-${runId}`,
        idempotencyKey: `infinitepay-payment-link-${runId}`,
        payer,
        paymentData: { method: 'payment_link' },
        metadata: { source: 'e2e', origin: 'infinitepay-one-time-test' },
        config: { environment: 'sandbox' },
      })
      .expect(200);

    expect(infinitePayPaymentResponse.body.data.paymentTransaction).toEqual(
      expect.objectContaining({
        checkoutSessionId: infinitePayCheckoutSessionId,
        paymentCustomerId,
        gatewayId: infinitePayGatewayId,
        apiCredentialId: infinitePayApiCredentialId,
        paymentMethod: 'payment_link',
        gatewayTransactionId: expect.any(String),
        checkoutUrl: expect.any(String),
        gatewayResponse: expect.objectContaining({
          endpoint: '/links',
          ok: true,
        }),
      }),
    );

    const stripeGatewayResponse = await api()
      .post('/api/v1/gateways/register')
      .send({
        name: 'Stripe Checkout',
        slug: `stripe-checkout-${runId}`,
        provider: 'stripe',
        config: {
          baseUrl: 'https://api.stripe.com',
          priority: 4,
          provider: 'stripe',
          cancelUrl: 'https://siplug.com/payment/cancel',
          isDefault: true,
          publicKey:
            'pk_test_51NyFKeI5wJUsAQoVuiYxNAXIjh1keapjn7PdmgL0bbu6bBXe8a4OK4rqfh8Q5wsVoMIVT6YQsOpxfBk0mz2w3IkE00mxA2js0r',
          successUrl:
            'https://siplug.com/payment/success?session_id={CHECKOUT_SESSION_ID}',
          environment: 'sandbox',
          paymentFlow: 'hosted_checkout',
          paymentTypes: ['one_time', 'recurring'],
          recurringFlow: 'checkout_session',
          recurringMode: 'gateway_native',
          paymentMethods: ['payment_link', 'credit_card', 'boleto'],
          stripePaymentMethods: ['card', 'payment_link', 'boleto'],
          supportsInstallments: false,
          supportsSplitPayment: false,
          supportsOneTimePayment: true,
          supportedPaymentMethods: ['payment_link', 'credit_card', 'boleto'],
          supportsRecurringPayment: true,
          testRun: tag,
        },
      })
      .expect(201);
    stripeGatewayId = stripeGatewayResponse.body.data._id;

    const stripeCredentialResponse = await api()
      .post('/api/v1/api-credentials/register')
      .send({
        officeId,
        gatewayId: stripeGatewayId,
        name: 'Stripe Checkout',
        slug: 'stripe-checkout',
        provider: 'stripe',
        providerType: 'gateway_provider',
        providerToken:
          'sk_test_51NyFKeI5wJUsAQoVamvVRk9U3LCf9F081cEnGhCWrpLCM0qYv83zhgOn4mgWOFqcg4wOhWNbB9I6nekcgafBNM3L004g6kuTdL',
        environment: 'local',
        config: {
          baseUrl: 'https://api.stripe.com',
          priority: 4,
          provider: 'stripe',
          cancelUrl: 'https://siplug.com/payment/cancel',
          isDefault: true,
          publicKey:
            'pk_test_51NyFKeI5wJUsAQoVuiYxNAXIjh1keapjn7PdmgL0bbu6bBXe8a4OK4rqfh8Q5wsVoMIVT6YQsOpxfBk0mz2w3IkE00mxA2js0r',
          successUrl:
            'https://siplug.com/payment/success?session_id={CHECKOUT_SESSION_ID}',
          environment: 'sandbox',
          paymentFlow: 'hosted_checkout',
          paymentTypes: ['one_time', 'recurring'],
          recurringFlow: 'checkout_session',
          recurringMode: 'gateway_native',
          paymentMethods: ['payment_link', 'credit_card', 'boleto'],
          stripePaymentMethods: ['card', 'payment_link', 'boleto'],
          supportsInstallments: false,
          supportsSplitPayment: false,
          supportsOneTimePayment: true,
          supportedPaymentMethods: ['payment_link', 'credit_card', 'boleto'],
          supportsRecurringPayment: true,
          testRun: tag,
        },
      })
      .expect(201);
    stripeApiCredentialId = stripeCredentialResponse.body.data._id;

    for (const paymentMethod of ['payment_link', 'credit_card', 'boleto']) {
      const checkoutSessionResponse = await api()
        .post('/api/v1/checkout-sessions/register')
        .send({
          officeId,
          clientId: userClientId,
          paymentCustomerId,
          gatewayId: stripeGatewayId,
          apiCredentialId: stripeApiCredentialId,
          code: `stripe-${paymentMethod}-${runId}`,
          externalReference: `stripe-${paymentMethod}-${runId}`,
          idempotencyKey: `stripe-${paymentMethod}-${runId}`,
          paymentType: 'one_time',
          amount: 1000,
          currency: 'BRL',
          description: `Stripe one-time ${paymentMethod} checkout`,
          successUrl:
            'https://siplug.com/payment/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: 'https://siplug.com/payment/cancel',
          items: [
            {
              itemRef: `stripe-item-${paymentMethod}-${runId}`,
              itemType: 'product',
              name: `Stripe ${paymentMethod} E2E item`,
              quantity: 1,
              unitAmount: 1000,
              totalAmount: 1000,
            },
          ],
          metadata: { paymentMethod, testRun: tag },
          config: { paymentMethod, environment: 'sandbox' },
        })
        .expect(201);

      const checkoutSessionId = asString(
        checkoutSessionResponse.body.data.checkoutSession._id,
      );
      const paymentResponse = await api()
        .post('/api/v1/payments/process')
        .send({
          checkoutSessionId,
          paymentMethod,
          externalReference: `stripe-${paymentMethod}-${runId}`,
          idempotencyKey: `stripe-${paymentMethod}-${runId}`,
          payer,
          paymentData: { method: paymentMethod },
          metadata: { source: 'e2e', origin: 'stripe-one-time-test' },
          config: { capture: true, environment: 'sandbox' },
        })
        .expect(200);

      expect(paymentResponse.body.data.paymentTransaction).toEqual(
        expect.objectContaining({
          checkoutSessionId,
          paymentCustomerId,
          gatewayId: stripeGatewayId,
          apiCredentialId: stripeApiCredentialId,
          paymentMethod,
          gatewayTransactionId: expect.any(String),
          checkoutUrl: expect.any(String),
          gatewayResponse: expect.objectContaining({
            endpoint: '/v1/checkout/sessions',
            ok: true,
          }),
        }),
      );
    }

    const pagSeguroGatewayResponse = await api()
      .post('/api/v1/gateways/register')
      .send({
        name: 'PagSeguro Checkout',
        slug: `pagseguro-checkout-${runId}`,
        provider: 'pagseguro',
        config: {
          baseUrl: 'https://sandbox.api.pagseguro.com',
          priority: 3,
          provider: 'pagseguro',
          isDefault: true,
          publicKey:
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB',
          environment: 'sandbox',
          paymentFlow: 'recurring_api',
          redirectUrl: 'https://siplug.com/payment/success',
          paymentTypes: ['one_time', 'recurring'],
          recurringFlow: 'subscription_api',
          recurringMode: 'gateway_native',
          paymentMethods: ['payment_link', 'pix', 'credit_card', 'boleto'],
          notificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/pagseguro/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          recurringBaseUrl: 'https://sandbox.api.assinaturas.pagseguro.com',
          supportsInstallments: false,
          supportsSplitPayment: true,
          webhookSignatureMode: 'optional',
          paymentNotificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/pagseguro/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportsOneTimePayment: true,
          checkoutNotificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/w/p/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportedPaymentMethods: [
            'payment_link',
            'pix',
            'credit_card',
            'boleto',
          ],
          payment_notification_url:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/w/p/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          recurringNotificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/pagseguro/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportsRecurringPayment: true,
          checkout_notification_url:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/w/p/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportedRecurringMethods: ['credit_card', 'boleto'],
          testRun: tag,
        },
      })
      .expect(201);
    pagSeguroGatewayId = pagSeguroGatewayResponse.body.data._id;

    const pagSeguroCredentialResponse = await api()
      .post('/api/v1/api-credentials/register')
      .send({
        officeId,
        gatewayId: pagSeguroGatewayId,
        name: 'PagSeguro Checkout',
        slug: 'pagseguro-checkout',
        provider: 'pagseguro',
        providerType: 'gateway_provider',
        providerToken:
          'd288d37a-78d4-4829-a939-5ab19efe32c9967a02854ae680c5ee3a4a76c8095b2e764f-89a2-4359-b420-2adf3b98f5a1',
        environment: 'local',
        config: {
          baseUrl: 'https://sandbox.api.pagseguro.com',
          priority: 3,
          provider: 'pagseguro',
          isDefault: true,
          publicKey:
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB',
          environment: 'sandbox',
          paymentFlow: 'recurring_api',
          redirectUrl: 'https://siplug.com/payment/success',
          paymentTypes: ['one_time', 'recurring'],
          recurringFlow: 'subscription_api',
          recurringMode: 'gateway_native',
          paymentMethods: ['payment_link', 'pix', 'credit_card', 'boleto'],
          notificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/pagseguro/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          recurringBaseUrl: 'https://sandbox.api.assinaturas.pagseguro.com',
          supportsInstallments: false,
          supportsSplitPayment: true,
          webhookSignatureMode: 'optional',
          paymentNotificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/pagseguro/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportsOneTimePayment: true,
          checkoutNotificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/w/p/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportedPaymentMethods: [
            'payment_link',
            'pix',
            'credit_card',
            'boleto',
          ],
          payment_notification_url:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/w/p/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          recurringNotificationUrl:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/pagseguro/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportsRecurringPayment: true,
          checkout_notification_url:
            'https://entrappingly-irreproachable-randal.ngrok-free.dev/w/p/84df07fe-3c59-4f76-b63a-dc0f7afd3d59',
          supportedRecurringMethods: ['credit_card', 'boleto'],
          testRun: tag,
        },
      })
      .expect(201);
    pagSeguroApiCredentialId = pagSeguroCredentialResponse.body.data._id;

    const pagSeguroPaymentMethods = [
      'payment_link',
      'pix',
      'boleto',
      'credit_card',
    ];
    const pagSeguroPayer = {
      ...payer,
      email: 'buyer-e2e@example.com',
    };

    for (const paymentMethod of pagSeguroPaymentMethods) {
      const checkoutSessionResponse = await api()
        .post('/api/v1/checkout-sessions/register')
        .send({
          officeId,
          clientId: userClientId,
          paymentCustomerId,
          gatewayId: pagSeguroGatewayId,
          apiCredentialId: pagSeguroApiCredentialId,
          code: `pagseguro-${paymentMethod}-${runId}`,
          externalReference: `pagseguro-${paymentMethod}-${runId}`,
          idempotencyKey: `pagseguro-${paymentMethod}-${runId}`,
          paymentType: 'one_time',
          amount: 1000,
          currency: 'BRL',
          description: `PagSeguro one-time ${paymentMethod} checkout`,
          successUrl: 'https://siplug.com/payment/success',
          cancelUrl: 'https://siplug.com/payment/cancel',
          items: [
            {
              itemRef: `pagseguro-item-${paymentMethod}-${runId}`,
              itemType: 'product',
              name: `PagSeguro ${paymentMethod} E2E item`,
              quantity: 1,
              unitAmount: 1000,
              totalAmount: 1000,
            },
          ],
          metadata: { paymentMethod, testRun: tag },
          config: { paymentMethod, environment: 'sandbox' },
        })
        .expect(201);

      const checkoutSession = checkoutSessionResponse.body.data.checkoutSession;
      expect(checkoutSession).toEqual(
        expect.objectContaining({
          paymentCustomerId,
          gatewayId: pagSeguroGatewayId,
          apiCredentialId: pagSeguroApiCredentialId,
          paymentType: 'one_time',
        }),
      );

      const checkoutSessionId = asString(checkoutSession._id);
      const paymentData =
        paymentMethod === 'credit_card'
          ? {
              method: 'credit_card',
              encryptedCard:
                'XC4gNM/hbN8C1dv+YStcEKYzZA9u7bXc8Ji3vFXZd72+OyGPsBuUu65KIk00ZyphJGQvDJjLH21/V/Ri4AuqMecxiFY3oeVhJutxanCYaQH9fRWawLo5qU9/beSou53IkOwBDliFTrzRy5JCG0V5Hye+k578644ZiLRvoVE/FbP/OwaQ8+iasT81N1USqZpLCBKHfFQ+UtgKObV/P/C+uwnh8gB2ybm0bkLH3nOKmcZkJM43fwD8U+KCfGxPPi4jYK6aoxXfsOhCBSfRqPklbBixyM19YvVUNGkln4OWxh/jPJhrmqwa7dEoBOfNhnqEkJVm5zdsHcVjMwKGMRvbpQ==',
            }
          : { method: paymentMethod };

      const paymentResponse = await api()
        .post('/api/v1/payments/process')
        .send({
          checkoutSessionId,
          paymentMethod,
          externalReference: `pagseguro-${paymentMethod}-${runId}`,
          idempotencyKey: `pagseguro-${paymentMethod}-${runId}`,
          payer: pagSeguroPayer,
          paymentData,
          metadata: { source: 'e2e', origin: 'pagseguro-one-time-test' },
          config: { capture: true, environment: 'sandbox' },
        })
        .expect(200);

      const paymentTransaction = paymentResponse.body.data.paymentTransaction;
      expect(paymentTransaction).toEqual(
        expect.objectContaining({
          checkoutSessionId,
          paymentCustomerId,
          gatewayId: pagSeguroGatewayId,
          apiCredentialId: pagSeguroApiCredentialId,
          paymentMethod,
          gatewayTransactionId: expect.any(String),
          gatewayResponse: expect.objectContaining({
            endpoint:
              paymentMethod === 'payment_link' ? '/checkouts' : '/orders',
            ok: true,
          }),
        }),
      );

      if (paymentMethod === 'payment_link') {
        expect(paymentTransaction.checkoutUrl).toEqual(expect.any(String));
      }

      if (paymentMethod === 'pix') {
        expect(paymentTransaction.qrCode).toEqual(expect.any(String));
      }

      if (paymentMethod === 'boleto') {
        expect(paymentTransaction.boletoUrl).toEqual(expect.any(String));
      }
    }
  }, 180_000);

  afterAll(async () => {
    try {
      await removeE2eData();
    } finally {
      await app?.close();
    }
  });

  async function removeE2eData(): Promise<void> {
    if (!prisma || !officeId) {
      return;
    }

    const gatewayIds = [
      gatewayId,
      infinitePayGatewayId,
      stripeGatewayId,
      pagSeguroGatewayId,
    ].filter((value): value is string => Boolean(value));
    const profileIds = [adminProfileId, userProfileId].filter(
      (value): value is string => Boolean(value),
    );

    await prisma.paymentWebhook.deleteMany({
      where: { gateway_id: { in: gatewayIds } },
    });
    await prisma.paymentTransactionEvent.deleteMany({
      where: { payment_transaction: { office_id: officeId } },
    });
    await prisma.paymentRefund.deleteMany({ where: { office_id: officeId } });
    await prisma.paymentSplitRecipient.deleteMany({
      where: { payment_split: { office_id: officeId } },
    });
    await prisma.paymentIdempotencyKey.deleteMany({
      where: { office_id: officeId },
    });
    await prisma.paymentRequest.deleteMany({ where: { office_id: officeId } });
    await prisma.paymentTransaction.deleteMany({
      where: { office_id: officeId },
    });
    await prisma.checkoutSessionItem.deleteMany({
      where: { checkout_session: { office_id: officeId } },
    });
    await prisma.checkoutSession.deleteMany({ where: { office_id: officeId } });
    await prisma.paymentCustomer.deleteMany({ where: { office_id: officeId } });
    await prisma.apiCredential.deleteMany({ where: { office_id: officeId } });
    await prisma.positionPermission.deleteMany({
      where: { position: { office_id: officeId } },
    });
    await prisma.userPosition.deleteMany({
      where: { user_customer: { client: { office_id: officeId } } },
    });
    await prisma.userAccessCode.deleteMany({
      where: { user_customer: { client: { office_id: officeId } } },
    });
    await prisma.userCustomer.deleteMany({
      where: { client: { office_id: officeId } },
    });
    await prisma.profile.deleteMany({
      where: { unique_id: { in: profileIds } },
    });
    await prisma.client.deleteMany({ where: { office_id: officeId } });
    await prisma.permission.deleteMany({ where: { office_id: officeId } });
    await prisma.position.deleteMany({ where: { office_id: officeId } });
    await prisma.gateway.deleteMany({
      where: { unique_id: { in: gatewayIds } },
    });
    await prisma.office.deleteMany({ where: { unique_id: officeId } });
  }

  function asString(value: unknown): string {
    expect(typeof value).toBe('string');
    return value as string;
  }
});
