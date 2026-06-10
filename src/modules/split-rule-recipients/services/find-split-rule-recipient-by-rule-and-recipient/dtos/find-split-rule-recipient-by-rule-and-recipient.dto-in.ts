export class FindSplitRuleRecipientByRuleAndRecipientDtoIn {
  public readonly splitRuleId: string;
  public readonly splitRecipientId: string;

  constructor(params: { splitRuleId?: unknown; splitRecipientId?: unknown }) {
    this.splitRuleId = String(params.splitRuleId ?? '').trim();
    this.splitRecipientId = String(params.splitRecipientId ?? '').trim();

    if (this.splitRuleId === '') {
      throw new Error('splitRuleId is required');
    }

    if (this.splitRecipientId === '') {
      throw new Error('splitRecipientId is required');
    }
  }
}
