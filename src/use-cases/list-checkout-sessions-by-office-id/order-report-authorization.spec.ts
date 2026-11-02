import { ListCheckoutSessionsByOfficeIdUseCase } from './list-checkout-sessions-by-office-id.use-case';
import { ListCheckoutSessionsByOfficeIdDtoIn } from './dtos/list-checkout-sessions-by-office-id.dto-in';
describe('Order report tenant boundary', () => {
  it('rejects another office even when the action permission is granted', async () => {
    const service = Object.create(
      ListCheckoutSessionsByOfficeIdUseCase.prototype,
    );
    service.resolveActorAuthorizationService = {
      exec: jest.fn().mockResolvedValue({ allowed: true }),
    };
    service.identity = {
      exec: jest
        .fn()
        .mockResolvedValue({ officeId: 'own-office', clientId: 'own-client' }),
    };
    service.report = { list: jest.fn() };
    service.handleUseCaseExceptionService = { exec: jest.fn() };
    await expect(
      service.exec(
        new ListCheckoutSessionsByOfficeIdDtoIn({
          token: 'test-token',
          officeId: 'foreign-office',
          report: true,
        }),
      ),
    ).rejects.toThrow('office not authorized');
    expect(service.report.list).not.toHaveBeenCalled();
  });
});
