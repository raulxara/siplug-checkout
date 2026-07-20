export class GetPermissionByUniqueIdDtoIn {
  public readonly permissionId: string;

  constructor(params: { permissionId?: unknown; _id?: unknown }) {
    this.permissionId = String(params.permissionId ?? params._id ?? '').trim();

    if (this.permissionId === '') {
      throw new Error('permissionId is required');
    }
  }
}
