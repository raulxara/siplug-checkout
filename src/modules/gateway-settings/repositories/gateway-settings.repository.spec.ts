import { GatewaySettingsRepository } from './gateway-settings.repository';
import type { PrismaService } from '../../../infra/database/prisma/prisma.service';
describe('Gateway configuration tenant isolation', () => {
  it('uses office and UUID together and refuses another office credential', async () => {
    const db = {
      apiCredential: { findFirst: jest.fn().mockResolvedValue(null) },
    };
    const repository = new GatewaySettingsRepository(
      db as unknown as PrismaService,
    );
    await expect(repository.one('office-a', 'credential-b')).rejects.toThrow();
    expect(db.apiCredential.findFirst).toHaveBeenCalledWith({
      where: { unique_id: 'credential-b', office_id: 'office-a' },
    });
  });
  it('rejects stale updates inside the tenant lock without writing', async () => {
    const tx = {
      $queryRaw: jest.fn(),
      apiCredential: {
        findFirst: jest
          .fn()
          .mockResolvedValue({ updated_at: new Date('2026-10-01') }),
        update: jest.fn(),
      },
    };
    const db = {
      $transaction: async (fn: (t: typeof tx) => unknown) => fn(tx),
    };
    const repository = new GatewaySettingsRepository(
      db as unknown as PrismaService,
    );
    await expect(
      repository.save(
        'office',
        'gateway',
        'sandbox',
        'credential',
        'stale',
        jest.fn(),
      ),
    ).rejects.toThrow('alterada');
    expect(tx.$queryRaw).toHaveBeenCalled();
    expect(tx.apiCredential.update).not.toHaveBeenCalled();
  });
  it('prevents duplicate gateway/environment credentials before a retry writes', async () => {
    const tx = {
      $queryRaw: jest.fn(),
      apiCredential: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ environment: 'sandbox', config: {} }]),
        create: jest.fn(),
      },
    };
    const db = {
      $transaction: async (fn: (t: typeof tx) => unknown) => fn(tx),
    };
    const repository = new GatewaySettingsRepository(
      db as unknown as PrismaService,
    );
    await expect(
      repository.save(
        'office',
        'gateway',
        'sandbox',
        undefined,
        undefined,
        jest.fn(),
      ),
    ).rejects.toThrow('Já existe');
    expect(tx.apiCredential.create).not.toHaveBeenCalled();
  });
});
