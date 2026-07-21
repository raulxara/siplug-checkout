export class ListApiCredentialByOfficeIdDtoOut {
  constructor(
    public readonly apiCredentials: Array<Record<string, unknown>>,
    public readonly total: number,
  ) {}
}
