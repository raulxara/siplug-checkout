import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SyncOwnProfileRequest } from './sync-own-profile.request';

describe('Profile synchronization request', () => {
  const address = {
    cep: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    country: 'Brasil',
  };
  const fields = {
    expectedSubject: 'remote-user',
    revision: '99cf6f62-289b-4a60-b38a-d8c795b41109',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+5511999999999',
    details: {
      billing: address,
      shipping: address,
      sameAsBilling: true,
      notifications: {
        system: true,
        sales: true,
        tips: false,
        marketing: false,
      },
    },
  };
  it('accepts complete profile data', async () => {
    expect(
      await validate(plainToInstance(SyncOwnProfileRequest, fields)),
    ).toHaveLength(0);
  });
  it('rejects missing nested details', async () => {
    expect(
      await validate(
        plainToInstance(SyncOwnProfileRequest, {
          ...fields,
          details: undefined,
        }),
      ),
    ).not.toHaveLength(0);
  });
  it('rejects malformed nested data and identity', async () => {
    expect(
      await validate(
        plainToInstance(SyncOwnProfileRequest, {
          ...fields,
          expectedSubject: '',
          details: { ...fields.details, billing: undefined },
        }),
      ),
    ).not.toHaveLength(0);
  });
});
