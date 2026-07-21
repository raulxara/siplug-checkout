export class ListPositionByOfficeIdDtoOut {
  constructor(
    public readonly positions: Array<Record<string, unknown>>,
    public readonly total: number,
  ) {}
}
