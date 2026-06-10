export class ListSplitRulesDtoIn {
  public readonly token: string;

  constructor(params: { token?: unknown }) {
    this.token = String(params.token ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }
  }
}
