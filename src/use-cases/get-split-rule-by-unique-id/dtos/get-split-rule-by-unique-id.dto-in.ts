export class GetSplitRuleByUniqueIdDtoIn {
  public readonly token: string;
  public readonly splitRuleId: string;

  constructor(params: { token?: unknown; splitRuleId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.splitRuleId = String(params.splitRuleId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.splitRuleId === '') {
      throw new Error('splitRuleId is required');
    }
  }
}
