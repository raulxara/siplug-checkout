export class GetAllSplitRecipientsByOfficeIdDtoOut {
  constructor(
    public readonly splitRecipients: Array<Record<string, unknown>>,
  ) {}
}
