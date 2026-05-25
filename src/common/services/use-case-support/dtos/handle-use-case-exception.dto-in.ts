export class HandleUseCaseExceptionDtoIn {
  public readonly useCase: string;
  public readonly error: unknown;
  public readonly context: Record<string, unknown>;
  public readonly appFile: string | null;

  constructor(params: {
    useCase: string;
    error: unknown;
    context?: Record<string, unknown>;
    appFile?: string | null;
  }) {
    this.useCase = params.useCase;
    this.error = params.error;
    this.context = params.context ?? {};
    this.appFile = params.appFile ?? null;

    if (this.useCase.trim() === '') {
      throw new Error('useCase is required');
    }
  }
}