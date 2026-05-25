export class DispatchLogProviderDtoOut {
  constructor(
    public readonly success: boolean,
    public readonly statusCode: number,
    public readonly body: Record<string, unknown>,
  ) {}
}