export class GetAllSplitRecipientsDtoOut {
  constructor(
    public readonly splitRecipients: Array<Record<string, unknown>>,
  ) {}
}