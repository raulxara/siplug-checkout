export class ValidatePicPayWebhookDtoOut {
  constructor(
    public readonly valid: boolean,
    public readonly skipped: boolean,
    public readonly reason: string | null,
  ) {}
}
