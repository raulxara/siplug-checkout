export class SyncSplitRuleRecipientsDtoOut {
  constructor(
    public readonly splitRule: Record<string, unknown>,
    public readonly splitRuleRecipients: Array<Record<string, unknown>>,
    public readonly createdCount: number,
    public readonly updatedCount: number,
    public readonly inactivatedCount: number,
  ) {}
}
