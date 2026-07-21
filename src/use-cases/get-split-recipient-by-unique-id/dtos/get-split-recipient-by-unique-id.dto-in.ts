export class GetSplitRecipientByUniqueIdDtoIn {
  public readonly token: string;
  public readonly splitRecipientId: string;

  constructor(params: { token?: unknown; splitRecipientId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.splitRecipientId = String(params.splitRecipientId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.splitRecipientId === '') {
      throw new Error('splitRecipientId is required');
    }
  }
}
