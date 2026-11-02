import { Test } from '@nestjs/testing';
import { ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { GetAuthContextUseCase } from './get-auth-context.use-case';
import { GetAuthContextController } from './get-auth-context.controller';
import { FindUserCustomerByTokenService } from '../../modules/user-customers/services/find-user-customer-by-token/find-user-customer-by-token.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

describe('Backend identity binding', () => {
  const customers = { exec: jest.fn() };
  const clients = { exec: jest.fn() };
  const offices = { exec: jest.fn() };
  let controller: GetAuthContextController;
  beforeEach(async () => {
    jest.resetAllMocks();
    customers.exec.mockResolvedValue({ userCustomer: { _id: 'member', clientId: 'client', status: 'active', token: 'do-not-return' } });
    clients.exec.mockResolvedValue({ client: { _id: 'client', officeId: 'office', status: 'active' } });
    offices.exec.mockResolvedValue({ office: { _id: 'office', status: 'active' } });
    const module = await Test.createTestingModule({ controllers: [GetAuthContextController], providers: [GetAuthContextUseCase,
      { provide: FindUserCustomerByTokenService, useValue: customers }, { provide: FindClientByUniqueIdService, useValue: clients },
      { provide: FindOfficeByUniqueIdService, useValue: offices }] }).compile();
    controller = module.get(GetAuthContextController);
  });
  it('returns only the authenticated tenant identity', async () => {
    await expect(controller.handle('Bearer opaque-token')).resolves.toEqual({ success: true, data: { officeId: 'office', clientId: 'client', userCustomerId: 'member' } });
  });
  it.each([undefined, '', 'Basic opaque-token'])('rejects missing or non-Bearer authentication', async header => {
    await expect(controller.handle(header)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(customers.exec).not.toHaveBeenCalled();
  });
  it('rejects inactive tenant', async () => {
    offices.exec.mockResolvedValue({ office: { _id: 'office', status: 'inactive' } });
    await expect(controller.handle('Bearer opaque-token')).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('does not leak database failures', async () => {
    customers.exec.mockRejectedValue(new Error('sql includes private credentials'));
    await expect(controller.handle('Bearer opaque-token')).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
