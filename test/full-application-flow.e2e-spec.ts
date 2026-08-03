import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infra/database/prisma/prisma.service';

/* supertest exposes response.body as any; assertions below validate its runtime shape. */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

describe('Full application flow (steps 1 to 3)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const runId = randomUUID();
  const tag = `e2e-${runId}`;
  const adminToken = `token-${runId}`;

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

  it('creates and verifies the base, gateway/credential and access-management flow', async () => {
    const gatewayResponse = await api()
      .post('/api/v1/gateways/register')
      .send({
        name: `Gateway ${tag}`,
        slug: `gateway-${runId}`,
        provider: 'stripe',
        config: { testRun: tag },
      })
      .expect(201);

    expect(gatewayResponse.body.status).toBe('success');
    gatewayId = gatewayResponse.body.data._id;
    expect(gatewayId).toEqual(expect.any(String));

    const updatedGatewayResponse = await api()
      .put('/api/v1/gateways/update')
      .send({ gatewayId, name: `Gateway updated ${tag}` })
      .expect(200);
    expect(updatedGatewayResponse.body.data.gateway.name).toBe(
      `Gateway updated ${tag}`,
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
        name: `Credential ${tag}`,
        slug: `credential-${runId}`,
        provider: 'stripe',
        providerType: 'payment',
        providerToken: 'fake-provider-token',
        environment: 'sandbox',
        config: { webhookSecret: 'fake-webhook-secret', testRun: tag },
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

    const updatedCredentialResponse = await api()
      .put('/api/v1/api-credentials/update')
      .send({
        apiCredentialId,
        name: `Credential updated ${tag}`,
        providerToken: 'fake-provider-token-updated',
      })
      .expect(200);
    expect(updatedCredentialResponse.body.data.apiCredential.name).toBe(
      `Credential updated ${tag}`,
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
  });

  afterAll(async () => {
    await app?.close();
  });
});
