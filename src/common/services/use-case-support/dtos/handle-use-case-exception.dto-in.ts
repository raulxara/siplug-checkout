export class HandleUseCaseExceptionDtoIn {
  public readonly useCase: string;
  public readonly error: unknown;
  public readonly context: Record<string, unknown>;

  constructor(params: {
    useCase: string;
    error: unknown;
    context?: Record<string, unknown>;
  }) {
    this.useCase = params.useCase;
    this.error = params.error;
    this.context = params.context ?? {};

    if (this.useCase.trim() === '') {
      throw new Error('useCase is required');
    }
  }
}