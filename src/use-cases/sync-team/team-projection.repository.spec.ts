import { TeamProjectionRepository } from './team-projection.repository';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { SyncTeamRequest } from './sync-team.request';
import {
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
const actor = {
  officeId: 'office',
  clientId: 'owner',
  userCustomerId: 'customer',
};
describe('TeamProjectionRepository', () => {
  function fixture() {
    let config: Record<string, unknown> = {
      userId: 'owner',
      customerId: 'customer',
      keep: true,
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      office: {
        findFirst: jest.fn().mockImplementation(() => ({ config })),
        update: jest.fn().mockImplementation((v) => {
          config = v.data.config;
        }),
      },
      position: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      positionPermission: { deleteMany: jest.fn(), create: jest.fn() },
      permission: { findFirst: jest.fn().mockResolvedValue(null) },
      officeEmployee: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
      },
      client: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      profile: {
        create: jest.fn(),
        update: jest.fn(),
        findUniqueOrThrow: jest
          .fn()
          .mockResolvedValue({ unique_id: 'profile', config: {} }),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      userCustomer: {
        create: jest.fn(),
        updateMany: jest.fn(),
        findUniqueOrThrow: jest
          .fn()
          .mockResolvedValue({ profile_id: 'profile' }),
      },
      userPosition: { deleteMany: jest.fn(), create: jest.fn() },
    };
    const db = { $transaction: jest.fn((fn) => fn(tx)) };
    const service = new TeamProjectionRepository(
      db as unknown as PrismaService,
    );
    const input = {
      expectedOffice: 'office',
      revision: 'revision',
      version: 1,
      positions: [
        { id: 'position', name: 'Sales', status: 'active', permissions: [] },
      ],
      members: [],
    } as SyncTeamRequest;
    return { service, tx, input };
  }
  it('rejects a cross-office payload before any transaction', async () => {
    const { service, input } = fixture();
    await expect(
      service.sync(actor, { ...input, expectedOffice: 'another' }, true),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
  it('requires the provisioned owner or verified administrator', async () => {
    const { service, input, tx } = fixture();
    await expect(
      service.sync({ ...actor, clientId: 'employee' }, input, false),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(tx.position.create).not.toHaveBeenCalled();
  });
  it('replays the same snapshot without duplicate roles and rejects changed payload', async () => {
    const { service, input, tx } = fixture();
    await service.sync(actor, input, false);
    await service.sync(actor, input, false);
    expect(tx.position.create).toHaveBeenCalledTimes(1);
    await expect(
      service.sync(actor, { ...input, positions: [] }, false),
    ).rejects.toBeInstanceOf(ConflictException);
  });
  it('never overwrites an administrator role', async () => {
    const { service, input, tx } = fixture();
    tx.position.findUnique.mockResolvedValue({
      office_id: 'office',
      slug: 'administrator',
    } as never);
    await expect(service.sync(actor, input, false)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(tx.position.update).not.toHaveBeenCalled();
  });
  it('fails closed when a mapped permission does not exist', async () => {
    const { service, input } = fixture();
    input.positions[0].permissions = ['sales.cancellations-refund'];
    await expect(service.sync(actor, input, false)).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
  });
  it('creates isolated employee identity with nonexposed credentials and no admin role', async () => {
    const { service, input, tx } = fixture();
    input.members = [
      {
        id: 'member',
        userId: 'backend-user',
        email: 'member@example.test',
        name: 'Member',
        phone: '5511999999999',
        status: 'inactive',
        positions: ['position'],
      },
    ];
    await service.sync(actor, input, false);
    expect(tx.client.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          office_id: 'office',
          user_type: 'employee',
          status: 'inactive',
        }),
      }),
    );
    expect(tx.officeEmployee.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          role: 'collaborator',
          two_fa_required: true,
        }),
      }),
    );
  });
});
