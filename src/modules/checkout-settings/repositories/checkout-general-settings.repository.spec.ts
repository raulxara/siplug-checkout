import { CheckoutGeneralSettingsRepository } from './checkout-general-settings.repository';
const values = {
  currency: 'BRL',
  environment: 'sandbox',
  successUrl: 'https://shop.example/return',
  cancelUrl: 'https://shop.example/cancel',
  sessionDurationMinutes: 60,
  paymentMethod: 'payment_link',
};
function setup() {
  process.env.CHECKOUT_FRONTEND_URL = 'http://localhost:3000';
  const office = {
    config: {
      onboarding: { complete: true },
      checkoutSettings: { ...values, version: 'v1' },
    },
    changes_history: [],
  };
  const tx = {
    $queryRaw: jest.fn(),
    office: {
      findFirst: jest.fn().mockResolvedValue(office),
      update: jest.fn(),
    },
  };
  const db = { $transaction: jest.fn(async (fn) => fn(tx)), office: tx.office };
  return {
    tx,
    office,
    repository: new CheckoutGeneralSettingsRepository(db as never),
  };
}
it('locks and updates only the authenticated office, preserving unrelated configuration', async () => {
  const { repository, tx } = setup();
  const result = await repository.save('office', 'actor', 'v1', values);
  expect(tx.$queryRaw).toHaveBeenCalled();
  expect(tx.office.findFirst).toHaveBeenCalledWith({
    where: { unique_id: 'office', status: 'active' },
  });
  expect(tx.office.update).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { unique_id: 'office' },
      data: expect.objectContaining({
        config: expect.objectContaining({ onboarding: { complete: true } }),
      }),
    }),
  );
  expect(result.version).not.toBe('v1');
});
it('rejects stale updates without overwriting the office', async () => {
  const { repository, tx } = setup();
  await expect(
    repository.save('office', 'actor', 'old', values),
  ).rejects.toThrow('alterada');
  expect(tx.office.update).not.toHaveBeenCalled();
});
it('does not create settings for a missing or inactive office', async () => {
  const { repository, tx } = setup();
  tx.office.findFirst.mockResolvedValue(null);
  await expect(
    repository.save('foreign', 'actor', 'initial', values),
  ).rejects.toThrow();
  expect(tx.office.update).not.toHaveBeenCalled();
});
