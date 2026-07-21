export class CreateUserPositionDtoIn {
  public readonly userCustomerId: string;
  public readonly positionId: string;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    userCustomerId: string;
    positionId: string;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.userCustomerId = params.userCustomerId;
    this.positionId = params.positionId;
    this.config = params.config ?? null;
    this.status = params.status ?? 'active';

    if (this.userCustomerId.trim() === '') {
      throw new Error('userCustomerId is required');
    }

    if (this.positionId.trim() === '') {
      throw new Error('positionId is required');
    }
  }
}