export class ListPermissionByOfficeIdDtoOut {
  constructor(
    public readonly permissions: Array<Record<string, unknown>>,
    public readonly total: number,
  ) {}
}
