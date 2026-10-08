import { assertSettlement } from './settlement-policy';
describe('settlement proof', () => {
  const r = { apiCredentialId: 'merchant', amount: 100, currency: 'BRL' };
  const e = { canonicalStatus: 'paid', amount: 100, currency: 'brl' };
  it('accepts matched settlement', () =>
    expect(() =>
      assertSettlement({ apiCredentialId: 'merchant' }, r, e),
    ).not.toThrow());
  it('rejects payment from another credential', () =>
    expect(() => assertSettlement({ apiCredentialId: 'other' }, r, e)).toThrow(
      'credential',
    ));
  it('rejects reduced amount', () =>
    expect(() =>
      assertSettlement({ apiCredentialId: 'merchant' }, r, { ...e, amount: 1 }),
    ).toThrow('amount'));
  it('rejects wrong currency', () =>
    expect(() =>
      assertSettlement({ apiCredentialId: 'merchant' }, r, {
        ...e,
        currency: 'USD',
      }),
    ).toThrow('currency'));
});
