export class FindSplitRecipientByUniqueIdDtoIn {
  public readonly splitRecipientId: string;

  constructor(splitRecipientId: unknown) {
    this.splitRecipientId = String(splitRecipientId ?? '').trim();

    if (this.splitRecipientId === '') {
      throw new Error('splitRecipientId is required');
    }
  }
}
