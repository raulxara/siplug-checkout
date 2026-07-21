export class ListPermissionPositionByPositionIdDtoOut {
  constructor(
    public readonly positionPermissions: Array<Record<string, unknown>>,
    public readonly total: number,
  ) {}
}
