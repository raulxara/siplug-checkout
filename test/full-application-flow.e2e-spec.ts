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
  let payPalGatewayId: string;
  let payPalApiCredentialId: string;
  let picPayGatewayId: string;
  let picPayApiCredentialId: string;
  let pagSeguroGatewayId: string;
  let pagSeguroApiCredentialId: string;
  let permissionId: string;
  let positionId: string;
  let userId: string;
  let userProfileId: string;
  let userClientId: string;
  let paymentCustomerId: string;
  let subscriptionPlanId: string;
  let subscriptionId: string;
  let subscriptionInvoiceId: string;

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

    const subscriptionPlanResponse = await api()
      .post('/api/v1/subscription-plans/register')
      .send({
        officeId,
        clientId: userClientId,
        gatewayId,
        apiCredentialId,
        name: 'E2E Monthly Plan',
        slug: `e2e-monthly-plan-${runId}`,
        description: 'Initial subscription plan description',
        billingInterval: 'month',
        billingIntervalCount: 1,
        amount: 2990,
        currency: 'BRL',
        trialDays: 0,
        maxBillingCycles: 12,
        paymentMethods: ['payment_link', 'credit_card'],
        metadata: { testRun: tag, source: 'e2e' },
        config: { billingAnchor: 'calendar_month' },
        status: 'active',
      })
      .expect(201);
    subscriptionPlanId =
      subscriptionPlanResponse.body.data.subscriptionPlan._id;
    expect(subscriptionPlanResponse.body.data.subscriptionPlan).toEqual(
      expect.objectContaining({
        _id: subscriptionPlanId,
        officeId,
        clientId: userClientId,
        gatewayId,
        apiCredentialId,
        billingInterval: 'month',
        billingIntervalCount: 1,
        amount: 2990,
        currency: 'BRL',
        status: 'active',
      }),
    );

    const subscriptionPlanByIdResponse = await api()
      .post('/api/v1/subscription-plans/get-by-unique-id')
      .send({ subscriptionPlanId })
      .expect(201);
    expect(subscriptionPlanByIdResponse.body.data.subscriptionPlan).toEqual(
      expect.objectContaining({ _id: subscriptionPlanId }),
    );

    const subscriptionPlansByOfficeResponse = await api()
      .post('/api/v1/subscription-plans/list-by-office-id')
      .send({ officeId })
      .expect(201);
    expect(
      subscriptionPlansByOfficeResponse.body.data.subscriptionPlans,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: subscriptionPlanId }),
      ]),
    );

    const updatedSubscriptionPlanResponse = await api()
      .put('/api/v1/subscription-plans/update')
      .send({
        subscriptionPlanId,
        description: 'Updated subscription plan description',
      })
      .expect(200);
    expect(updatedSubscriptionPlanResponse.body.data.subscriptionPlan).toEqual(
      expect.objectContaining({
        _id: subscriptionPlanId,
        description: 'Updated subscription plan description',
      }),
    );

    const subscriptionResponse = await api()
      .post('/api/v1/subscriptions/register')
      .send({
        officeId,
        clientId: userClientId,
        subscriptionPlanId,
        paymentCustomerId,
        gatewayId,
        apiCredentialId,
        externalReference: `subscription-${runId}`,
        nextBillingAt: '2026-08-01T00:00:00.000Z',
        metadata: { testRun: tag, source: 'e2e' },
        config: { source: 'full-application-flow' },
        status: 'created',
      })
      .expect(201);
    subscriptionId = subscriptionResponse.body.data.subscription._id;
    expect(subscriptionResponse.body.data.subscription).toEqual(
      expect.objectContaining({
        _id: subscriptionId,
        subscriptionPlanId,
        paymentCustomerId,
        amount: 2990,
        currency: 'BRL',
        currentCycle: 0,
        status: 'created',
      }),
    );

    const subscriptionByIdResponse = await api()
      .post('/api/v1/subscriptions/get-by-unique-id')
      .send({ subscriptionId })
      .expect(201);
    expect(subscriptionByIdResponse.body.data.subscription).toEqual(
      expect.objectContaining({ _id: subscriptionId }),
    );

    const subscriptionsByOfficeResponse = await api()
      .post('/api/v1/subscriptions/list-by-office-id')
      .send({ officeId })
      .expect(201);
    expect(subscriptionsByOfficeResponse.body.data.subscriptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: subscriptionId }),
      ]),
    );

    const updatedSubscriptionResponse = await api()
      .put('/api/v1/subscriptions/update')
      .send({
        subscriptionId,
        nextBillingAt: '2026-08-01T00:00:00.000Z',
        metadata: { testRun: tag, updated: true },
      })
      .expect(200);
    expect(updatedSubscriptionResponse.body.data.subscription).toEqual(
      expect.objectContaining({
        _id: subscriptionId,
        currentCycle: 0,
        status: 'created',
      }),
    );

    const generatedInvoiceResponse = await api()
      .post('/api/v1/subscription-invoices/generate')
      .send({
        subscriptionId,
        scheduledAt: '2026-08-01T00:00:00.000Z',
        dueAt: '2026-08-01T00:00:00.000Z',
      })
      .expect(201);
    subscriptionInvoiceId =
      generatedInvoiceResponse.body.data.subscriptionInvoice._id;
    expect(generatedInvoiceResponse.body.data.subscription).toEqual(
      expect.objectContaining({
        _id: subscriptionId,
        currentCycle: 1,
        status: 'active',
      }),
    );
    expect(generatedInvoiceResponse.body.data.subscriptionCycle).toEqual(
      expect.objectContaining({
        subscriptionId,
        cycleNumber: 1,
        amount: 2990,
        currency: 'BRL',
        status: 'scheduled',
      }),
    );
    expect(generatedInvoiceResponse.body.data.subscriptionInvoice).toEqual(
      expect.objectContaining({
        _id: subscriptionInvoiceId,
        subscriptionId,
        amount: 2990,
        currency: 'BRL',
        status: 'created',
      }),
    );

    const subscriptionInvoiceByIdResponse = await api()
      .post('/api/v1/subscription-invoices/get-by-unique-id')
      .send({ subscriptionInvoiceId })
      .expect(201);
    expect(
      subscriptionInvoiceByIdResponse.body.data.subscriptionInvoice,
    ).toEqual(expect.objectContaining({ _id: subscriptionInvoiceId }));

    const subscriptionInvoicesByOfficeResponse = await api()
      .post('/api/v1/subscription-invoices/list-by-office-id')
      .send({ officeId })
      .expect(201);
    expect(
      subscriptionInvoicesByOfficeResponse.body.data.subscriptionInvoices,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: subscriptionInvoiceId }),
      ]),
    );

    const recurringCheckoutSessionResponse = await api()
      .post('/api/v1/checkout-sessions/register')
      .send({
        officeId,
        clientId: userClientId,
        paymentCustomerId,
        gatewayId,
        apiCredentialId,
        code: `mercado-pago-recurring-${runId}`,
        externalReference: `mercado-pago-recurring-${runId}`,
        idempotencyKey: `mercado-pago-recurring-${runId}`,
        paymentType: 'recurring',
        amount: 2990,
        currency: 'BRL',
        description: 'Mercado Pago recurring subscription checkout',
        successUrl: 'https://siplug.com/payment/success',
        cancelUrl: 'https://siplug.com/payment/cancel',
        items: [
          {
            itemRef: `mercado-pago-recurring-item-${runId}`,
            itemType: 'subscription_plan',
            name: 'E2E Monthly Plan',
            quantity: 1,
            unitAmount: 2990,
            totalAmount: 2990,
          },
        ],
        metadata: { testRun: tag, paymentType: 'recurring' },
        config: {
          environment: 'sandbox',
          subscription: {
            subscriptionPlanId,
            recurringMode: 'gateway_native',
          },
        },
      })
      .expect(201);
    const recurringCheckoutSession =
      recurringCheckoutSessionResponse.body.data.checkoutSession;
    const recurringCheckoutSessionId = asString(recurringCheckoutSession._id);
    expect(recurringCheckoutSession).toEqual(
      expect.objectContaining({
        _id: recurringCheckoutSessionId,
        paymentType: 'recurring',
        paymentCustomerId,
        gatewayId,
        apiCredentialId,
      }),
    );

    const mercadoPagoRecurringResponse = await api()
      .post('/api/v1/payments/process-recurring')
      .send({
        checkoutSessionId: recurringCheckoutSessionId,
        paymentMethod: 'payment_link',
        gatewayProvider: 'mercado_pago',
        gatewayId,
        apiCredentialId,
        payer,
        paymentData: { method: 'payment_link' },
        metadata: {
          source: 'e2e',
          origin: 'mercado-pago-recurring-test',
        },
        config: { environment: 'sandbox' },
      })
      .expect(200);

    expect(mercadoPagoRecurringResponse.body.data.subscription).toEqual(
      expect.objectContaining({
        subscriptionPlanId,
        paymentCustomerId,
        gatewayId,
        apiCredentialId,
        status: 'pending',
        gatewaySubscriptionId: expect.any(String),
      }),
    );
    expect(mercadoPagoRecurringResponse.body.data.subscriptionCycle).toEqual(
      expect.objectContaining({
        cycleNumber: 1,
        amount: 2990,
        currency: 'BRL',
      }),
    );
    expect(mercadoPagoRecurringResponse.body.data.subscriptionInvoice).toEqual(
      expect.objectContaining({
        amount: 2990,
        currency: 'BRL',
        status: 'processing',
      }),
    );
    expect(mercadoPagoRecurringResponse.body.data.paymentTransaction).toEqual(
      expect.objectContaining({
        paymentType: 'recurring',
        paymentMethod: 'payment_link',
        gatewayId,
        apiCredentialId,
        gatewayTransactionId: expect.any(String),
        checkoutUrl: expect.any(String),
        gatewayResponse: expect.objectContaining({
          endpoint: '/preapproval',
          ok: true,
        }),
      }),
    );
    expect(mercadoPagoRecurringResponse.body.data.checkoutSession).toEqual(
      expect.objectContaining({
        _id: recurringCheckoutSessionId,
        status: 'processing',
      }),
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

    for (const paymentMethod of ['payment_link', 'credit_card', 'boleto']) {
      const stripeRecurringCheckoutSessionResponse = await api()
        .post('/api/v1/checkout-sessions/register')
        .send({
          officeId,
          clientId: userClientId,
          paymentCustomerId,
          gatewayId: stripeGatewayId,
          apiCredentialId: stripeApiCredentialId,
          code: `stripe-recurring-${paymentMethod}-${runId}`,
          externalReference: `stripe-recurring-${paymentMethod}-${runId}`,
          idempotencyKey: `stripe-recurring-${paymentMethod}-${runId}`,
          paymentType: 'recurring',
          amount: 2990,
          currency: 'BRL',
          description: `Stripe recurring ${paymentMethod} subscription checkout`,
          successUrl:
            'https://siplug.com/payment/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: 'https://siplug.com/payment/cancel',
          items: [
            {
              itemRef: `stripe-recurring-item-${paymentMethod}-${runId}`,
              itemType: 'subscription_plan',
              name: `Stripe recurring ${paymentMethod} E2E plan`,
              quantity: 1,
              unitAmount: 2990,
              totalAmount: 2990,
            },
          ],
          metadata: {
            testRun: tag,
            paymentMethod,
            paymentType: 'recurring',
          },
          config: {
            environment: 'sandbox',
            subscription: {
              subscriptionPlanId,
              recurringMode: 'gateway_native',
            },
          },
        })
        .expect(201);

      const stripeRecurringCheckoutSession =
        stripeRecurringCheckoutSessionResponse.body.data.checkoutSession;
      const stripeRecurringCheckoutSessionId = asString(
        stripeRecurringCheckoutSession._id,
      );
      expect(stripeRecurringCheckoutSession).toEqual(
        expect.objectContaining({
          _id: stripeRecurringCheckoutSessionId,
          paymentType: 'recurring',
          paymentCustomerId,
          gatewayId: stripeGatewayId,
          apiCredentialId: stripeApiCredentialId,
        }),
      );

      const stripeRecurringResponse = await api()
        .post('/api/v1/payments/process-recurring')
        .send({
          checkoutSessionId: stripeRecurringCheckoutSessionId,
          paymentMethod,
          gatewayProvider: 'stripe',
          gatewayId: stripeGatewayId,
          apiCredentialId: stripeApiCredentialId,
          payer,
          paymentData: { method: paymentMethod },
          metadata: {
            source: 'e2e',
            origin: 'stripe-recurring-test',
          },
          config: { environment: 'sandbox' },
        })
        .expect(200);

      expect(stripeRecurringResponse.body.data.subscription).toEqual(
        expect.objectContaining({
          subscriptionPlanId,
          paymentCustomerId,
          gatewayId: stripeGatewayId,
          apiCredentialId: stripeApiCredentialId,
          status: 'pending',
          gatewaySubscriptionId: null,
        }),
      );
      expect(stripeRecurringResponse.body.data.subscriptionCycle).toEqual(
        expect.objectContaining({
          cycleNumber: 1,
          amount: 2990,
          currency: 'BRL',
          status: 'scheduled',
        }),
      );
      expect(stripeRecurringResponse.body.data.subscriptionInvoice).toEqual(
        expect.objectContaining({
          amount: 2990,
          currency: 'BRL',
          status: 'processing',
        }),
      );
      expect(stripeRecurringResponse.body.data.paymentTransaction).toEqual(
        expect.objectContaining({
          checkoutSessionId: stripeRecurringCheckoutSessionId,
          paymentCustomerId,
          gatewayId: stripeGatewayId,
          apiCredentialId: stripeApiCredentialId,
          paymentType: 'recurring',
          paymentMethod,
          gatewayTransactionId: expect.any(String),
          checkoutUrl: expect.any(String),
          gatewayResponse: expect.objectContaining({
            endpoint: '/checkout/sessions',
            ok: true,
          }),
        }),
      );
      expect(stripeRecurringResponse.body.data.checkoutSession).toEqual(
        expect.objectContaining({
          _id: stripeRecurringCheckoutSessionId,
          status: 'processing',
          config: expect.objectContaining({
            subscription: expect.objectContaining({
              subscriptionPlanId,
              checkoutUrl: expect.any(String),
            }),
          }),
        }),
      );
    }

    const payPalConfig = {
      locale: 'pt-BR',
      baseUrl: 'https://api-m.sandbox.paypal.com',
      clientId:
        'Ae5tufmOUCmziXrbTsebg-RjninDjCq6CnBH57v6djLsX_Y_aDCSN0nUqiRLkfmLXbxYcyu2hS8iWG7Z',
      priority: 5,
      provider: 'paypal',
      brandName: 'SiPlug',
      cancelUrl:
        'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/paypal/checkout/cancel/72e03f9b-298c-414e-aa9d-1879aed3e137',
      isDefault: true,
      returnUrl:
        'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/paypal/checkout/return/72e03f9b-298c-414e-aa9d-1879aed3e137',
      successUrl: 'https://siplug.com/payment/success',
      webhookUrl:
        'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/paypal/72e03f9b-298c-414e-aa9d-1879aed3e137',
      environment: 'sandbox',
      paymentFlow: 'hosted_checkout',
      paymentTypes: ['one_time', 'recurring'],
      recurringFlow: 'approval_url',
      recurringMode: 'gateway_native',
      paymentMethods: ['payment_link', 'credit_card'],
      paypalWebhookId: '5TB94554A3207893N',
      webhookAuthMode: 'required',
      paypalCaptureMode: 'return_capture',
      paypalCancelBaseUrl:
        'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/paypal/checkout/cancel',
      paypalReturnBaseUrl:
        'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/paypal/checkout/return',
      supportsInstallments: false,
      supportsSplitPayment: false,
      supportsOneTimePayment: true,
      supportedPaymentMethods: ['payment_link', 'credit_card'],
      supportsRecurringPayment: true,
      supportedRecurringMethods: ['payment_link', 'credit_card'],
      testRun: tag,
    };

    const payPalGatewayResponse = await api()
      .post('/api/v1/gateways/register')
      .send({
        name: 'PayPal Checkout',
        slug: `paypal-checkout-${runId}`,
        provider: 'paypal',
        config: payPalConfig,
      })
      .expect(201);
    payPalGatewayId = payPalGatewayResponse.body.data._id;

    const payPalCredentialResponse = await api()
      .post('/api/v1/api-credentials/register')
      .send({
        officeId,
        gatewayId: payPalGatewayId,
        name: 'PayPal Checkout',
        slug: 'paypal-checkout',
        provider: 'paypal',
        providerType: 'gateway_provider',
        providerToken:
          'EBR_InU4hE87bSy9pgS75g2BlWdp1jK8gpZickZI54wgLtJtsuyIi_JfCujuk-ovvkSkqvAKYd-eyIra',
        environment: 'local',
        config: payPalConfig,
      })
      .expect(201);
    payPalApiCredentialId = payPalCredentialResponse.body.data._id;

    for (const paymentMethod of ['payment_link', 'credit_card']) {
      const checkoutSessionResponse = await api()
        .post('/api/v1/checkout-sessions/register')
        .send({
          officeId,
          clientId: userClientId,
          paymentCustomerId,
          gatewayId: payPalGatewayId,
          apiCredentialId: payPalApiCredentialId,
          code: `paypal-${paymentMethod}-${runId}`,
          externalReference: `paypal-${paymentMethod}-${runId}`,
          idempotencyKey: `paypal-${paymentMethod}-${runId}`,
          paymentType: 'one_time',
          amount: 1000,
          currency: 'BRL',
          description: `PayPal one-time ${paymentMethod} checkout`,
          successUrl: payPalConfig.successUrl,
          cancelUrl: payPalConfig.cancelUrl,
          items: [
            {
              itemRef: `paypal-item-${paymentMethod}-${runId}`,
              itemType: 'product',
              name: `PayPal ${paymentMethod} E2E item`,
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
          externalReference: `paypal-${paymentMethod}-${runId}`,
          idempotencyKey: `paypal-${paymentMethod}-${runId}`,
          payer,
          paymentData: { method: paymentMethod },
          metadata: { source: 'e2e', origin: 'paypal-one-time-test' },
          config: { capture: true, environment: 'sandbox' },
        })
        .expect(200);

      expect(paymentResponse.body.data.paymentTransaction).toEqual(
        expect.objectContaining({
          checkoutSessionId,
          paymentCustomerId,
          gatewayId: payPalGatewayId,
          apiCredentialId: payPalApiCredentialId,
          paymentMethod,
          gatewayTransactionId: expect.any(String),
          checkoutUrl: expect.any(String),
          gatewayResponse: expect.objectContaining({
            endpoint: '/v2/checkout/orders',
            ok: true,
          }),
        }),
      );
    }

    const picPayConfig = {
      sdkUrl: 'https://checkout.picpay.com/cdn/pp-transparent-v1.0.0.js',
      apiPath: '/sandbox/v1',
      baseUrl: 'https://api.ms.qa.limbo.work',
      clientId: 'bc3d001b-5f20-4e96-b500-f52426f31750',
      priority: 6,
      provider: 'picpay',
      tokenUrl: 'https://api.ms.qa.limbo.work/oauth2/token',
      cancelUrl: 'https://siplug.com/payment/cancel',
      isDefault: true,
      returnUrl: 'https://siplug.com/payment/success',
      authBaseUrl: 'https://api.ms.qa.limbo.work',
      environment: 'sandbox',
      paymentFlow: 'recurring_api',
      paymentTypes: ['one_time', 'recurring'],
      recurringFlow: 'subscription_api',
      recurringMode: 'gateway_native',
      paymentMethods: ['payment_link', 'pix', 'credit_card'],
      notificationUrl:
        'https://entrappingly-irreproachable-randal.ngrok-free.dev/api/v1/webhooks/gateways/picpay/54226dcd-7766-409e-85c7-b60a00053d07',
      webhookAuthMode: 'optional',
      recurringBaseUrl: 'https://ecommerce-api.svcp.ppay.me/sandbox/v1',
      transparentToken: 'card_ZVHmBRSw3EjkJ7s93Vm4S5FiZwuQjgTi',
      merchantCredential: '51461116000169',
      supportsInstallments: true,
      supportsSplitPayment: false,
      supportsOneTimePayment: true,
      supportedPaymentMethods: ['payment_link', 'pix', 'credit_card'],
      supportsRecurringPayment: true,
      testRun: tag,
    };

    const picPayGatewayResponse = await api()
      .post('/api/v1/gateways/register')
      .send({
        name: 'PicPay Checkout',
        slug: `picpay-checkout-${runId}`,
        provider: 'picpay',
        config: picPayConfig,
      })
      .expect(201);
    picPayGatewayId = picPayGatewayResponse.body.data._id;

    const picPayCredentialResponse = await api()
      .post('/api/v1/api-credentials/register')
      .send({
        officeId,
        gatewayId: picPayGatewayId,
        name: 'PicPay Checkout',
        slug: 'picpay-checkout',
        provider: 'picpay',
        providerType: 'gateway_provider',
        providerToken: 'L4ncXaitkazaQRZMFzAoZ1XhZ9umQmQS',
        environment: 'local',
        config: picPayConfig,
      })
      .expect(201);
    picPayApiCredentialId = picPayCredentialResponse.body.data._id;

    for (const paymentMethod of ['payment_link', 'pix']) {
      const checkoutSessionResponse = await api()
        .post('/api/v1/checkout-sessions/register')
        .send({
          officeId,
          clientId: userClientId,
          paymentCustomerId,
          gatewayId: picPayGatewayId,
          apiCredentialId: picPayApiCredentialId,
          code: `picpay-${paymentMethod}-${runId}`,
          externalReference: `picpay-${paymentMethod}-${runId}`,
          idempotencyKey: `picpay-${paymentMethod}-${runId}`,
          paymentType: 'one_time',
          amount: 1000,
          currency: 'BRL',
          description: `PicPay one-time ${paymentMethod} checkout`,
          successUrl: picPayConfig.returnUrl,
          cancelUrl: picPayConfig.cancelUrl,
          items: [
            {
              itemRef: `picpay-item-${paymentMethod}-${runId}`,
              itemType: 'product',
              name: `PicPay ${paymentMethod} E2E item`,
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
          externalReference: `picpay-${paymentMethod}-${runId}`,
          idempotencyKey: `picpay-${paymentMethod}-${runId}`,
          payer,
          paymentData: { method: paymentMethod },
          metadata: { source: 'e2e', origin: 'picpay-one-time-test' },
          config: { capture: true, environment: 'sandbox' },
        })
        .expect(200);

      const paymentTransaction = paymentResponse.body.data.paymentTransaction;
      expect(paymentTransaction).toEqual(
        expect.objectContaining({
          checkoutSessionId,
          paymentCustomerId,
          gatewayId: picPayGatewayId,
          apiCredentialId: picPayApiCredentialId,
          paymentMethod,
          gatewayTransactionId: expect.any(String),
          checkoutUrl: expect.any(String),
          gatewayResponse: expect.objectContaining({
            endpoint: '/sandbox/v1/paymentlink/create',
            ok: true,
          }),
        }),
      );

      if (paymentMethod === 'pix') {
        expect(paymentTransaction.qrCode).toEqual(expect.any(String));
      }

      if (paymentMethod === 'payment_link') {
        expect(paymentTransaction.providerPayload).toEqual(
          expect.objectContaining({
            charge: expect.objectContaining({
              payment: expect.objectContaining({
                methods: expect.arrayContaining(['BRCODE', 'CREDIT_CARD']),
              }),
            }),
          }),
        );
      }
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
                'CwCE9Y5crNTLB/R61h6b7/Hjn8QZdGE8JSwxRuRfJ7vR4pmuOka0AzKLlf9/AepHS/P0P17lvJt0UtW8iIkMpyo2IIPuh/4twcBKvwQdc+a+RXrSav3zm0nb646B3zoH7nqUjq9o5V30k8LzF1KNaprXF3s2V7+HYiiZ+SBnDxD3AF2RiNdIQmzjcovNNSCKVF9O24DWaSW0iU7O5dDF2teoQokjApjCZ/sxmfxLQZCjhKnna49VD3WsG9M4HpDgBc2r8Lqwi6nWcgH4lUDM0XbR3tLNCRx4L5x5LUOXmig64LaGjrNTwq6aVuzpcCWg/zErI3kLF/DuV6va+RNc7Q==',
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
      payPalGatewayId,
      picPayGatewayId,
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
    await prisma.subscriptionInvoice.deleteMany({
      where: { subscription: { office_id: officeId } },
    });
    await prisma.subscriptionCycle.deleteMany({
      where: { subscription: { office_id: officeId } },
    });
    await prisma.subscriptionEvent.deleteMany({
      where: { subscription: { office_id: officeId } },
    });
    await prisma.subscription.deleteMany({ where: { office_id: officeId } });
    await prisma.subscriptionPlan.deleteMany({
      where: { office_id: officeId },
    });
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
