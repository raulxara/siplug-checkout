import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SyncCompanyProfileRequest } from './sync-company-profile.request';
import { SyncCompanyProfileUseCase } from './sync-company-profile.use-case';
import { CompanyProfilesRepository } from './company-profiles.repository';
import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
describe('Company synchronization', () => {
  const fields = {
    expectedOffice: 'office-a',
    revision: '99cf6f62-289b-4a60-b38a-d8c795b41109',
    version: 1,
    name: 'Company',
    legalName: null,
    email: null,
    phone: null,
    document: null,
    address: { cep: null, country: 'BR' },
  };
  it('accepts optional empty company contact fields', async () => {
    expect(
      await validate(plainToInstance(SyncCompanyProfileRequest, fields)),
    ).toHaveLength(0);
  });
  it('rejects malformed versions and missing address', async () => {
    expect(
      await validate(
        plainToInstance(SyncCompanyProfileRequest, {
          ...fields,
          version: 0,
          address: undefined,
        }),
      ),
    ).not.toHaveLength(0);
  });
  it('rejects cross-company requests before persistence', async () => {
    const repo = { sync: jest.fn() };
    const auth = { exec: jest.fn().mockResolvedValue({ officeId: 'other' }) };
    const permission = { exec: jest.fn() };
    const useCase = new SyncCompanyProfileUseCase(
      auth as unknown as GetAuthContextUseCase,
      permission as unknown as ResolveActorAuthorizationService,
      repo as unknown as CompanyProfilesRepository,
    );
    await expect(
      useCase.exec('token', plainToInstance(SyncCompanyProfileRequest, fields)),
    ).rejects.toThrow();
    expect(repo.sync).not.toHaveBeenCalled();
  });
  it('does not turn a permission failure into administrator authorization', async () => {
    const actor = {
      officeId: 'office-a',
      clientId: 'user',
      userCustomerId: 'customer',
    };
    const repo = { sync: jest.fn().mockResolvedValue({}) };
    const auth = { exec: jest.fn().mockResolvedValue(actor) };
    const permission = {
      exec: jest.fn().mockRejectedValue(new Error('denied')),
    };
    const useCase = new SyncCompanyProfileUseCase(
      auth as unknown as GetAuthContextUseCase,
      permission as unknown as ResolveActorAuthorizationService,
      repo as unknown as CompanyProfilesRepository,
    );
    const input = plainToInstance(SyncCompanyProfileRequest, fields);
    await useCase.exec('token', input);
    expect(repo.sync).toHaveBeenCalledWith(actor, input, false);
  });
});
