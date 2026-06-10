export class GetAllSplitRuleRecipientsBySplitRuleIdDtoIn {
  public readonly splitRuleId: string;

  constructor(splitRuleId: unknown) {
    this.splitRuleId = String(splitRuleId ?? '').trim();

    if (this.splitRuleId === '') {
      throw new Error('splitRuleId is required');
    }
  }
}
