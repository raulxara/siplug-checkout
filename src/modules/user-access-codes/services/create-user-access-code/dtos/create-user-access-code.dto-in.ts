export class CreateUserAccessCodeDtoIn {
  public readonly userCustomerId: string;
  public readonly channel: string;
  public readonly destination: string;
  public readonly code: string;
  public readonly expiresAt: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    userCustomerId: string;
    channel: string;
    destination: string;
    code: string;
    expiresAt?: string | null;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.userCustomerId = params.userCustomerId;
    this.channel = params.channel;
    this.destination = params.destination;
    this.code = params.code;
    this.expiresAt = params.expiresAt ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? 'created';

    if (this.userCustomerId.trim() === '') {
      throw new Error('userCustomerId is required');
    }

    if (this.channel.trim() === '') {
      throw new Error('channel is required');
    }

    if (this.destination.trim() === '') {
      throw new Error('destination is required');
    }

    if (this.code.trim() === '') {
      throw new Error('code is required');
    }
  }
}