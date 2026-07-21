export class ResolveActorAuthorizationDtoIn {
  public readonly token: string;
  public readonly requiredAction: string;
  public readonly requiredEntity: string | null;

  constructor(params: {
    token: string;
    requiredAction: string;
    requiredEntity?: string | null;
  }) {
    this.token = params.token;
    this.requiredAction = params.requiredAction;
    this.requiredEntity = params.requiredEntity ?? null;

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.requiredAction.trim() === '') {
      throw new Error('requiredAction is required');
    }
  }
}