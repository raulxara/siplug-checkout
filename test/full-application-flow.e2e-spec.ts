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
  });

  afterAll(async () => {
    await app?.close();
  });

  function asString(value: unknown): string {
    expect(typeof value).toBe('string');
    return value as string;
  }
});
