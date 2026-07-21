export class CheckUserPermissionDtoIn {
  public readonly userCustomerId: string;
  public readonly requiredAction: string;
  public readonly requiredEntity: string | null;

  constructor(params: {
    userCustomerId: string;
    requiredAction: string;
    requiredEntity?: string | null;
  }) {
    this.userCustomerId = params.userCustomerId;
    this.requiredAction = params.requiredAction;
    this.requiredEntity = params.requiredEntity ?? null;

    if (this.userCustomerId.trim() === '') {
      throw new Error('userCustomerId is required');
    }

    if (this.requiredAction.trim() === '') {
      throw new Error('requiredAction is required');
    }
  }
}