export class ListSplitRecipientsByOfficeIdDtoOut {
  constructor(
    public readonly splitRecipients: Array<Record<string, unknown>>,
  ) {}
}
