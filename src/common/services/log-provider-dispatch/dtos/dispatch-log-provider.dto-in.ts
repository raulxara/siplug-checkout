export class DispatchLogProviderDtoIn {
  public readonly appName: string;
  public readonly appEnv: string;
  public readonly appFile: string;
  public readonly useCase: string;
  public readonly type: string;
  public readonly message: string;
  public readonly trace: string | null;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    appName: string;
    appEnv: string;
    appFile: string;
    useCase: string;
    type: string;
    message: string;
    trace?: string | null;
    config?: Record<string, unknown> | null;
  }) {
    this.appName = params.appName;
    this.appEnv = params.appEnv;
    this.appFile = params.appFile;
    this.useCase = params.useCase;
    this.type = params.type;
    this.message = params.message;
    this.trace = params.trace ?? null;
    this.config = params.config ?? null;

    if (this.appName.trim() === '') {
      throw new Error('appName is required');
    }

    if (this.appEnv.trim() === '') {
      throw new Error('appEnv is required');
    }

    if (this.appFile.trim() === '') {
      throw new Error('appFile is required');
    }

    if (this.useCase.trim() === '') {
      throw new Error('useCase is required');
    }

    if (this.type.trim() === '') {
      throw new Error('type is required');
    }

    if (this.message.trim() === '') {
      throw new Error('message is required');
    }
  }
}