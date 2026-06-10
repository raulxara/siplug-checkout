export class GetAllSplitRuleRecipientsBySplitRuleIdDtoOut {
  constructor(
    public readonly splitRuleRecipients: Array<Record<string, unknown>>,
  ) {}
}
