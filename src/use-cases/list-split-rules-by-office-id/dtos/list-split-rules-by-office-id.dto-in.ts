export class ListSplitRulesByOfficeIdDtoIn {
  public readonly token: string;
  public readonly officeId: string;

  constructor(params: { token?: unknown; officeId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.officeId = String(params.officeId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.officeId === '') {
      throw new Error('officeId is required');
    }
  }
}
