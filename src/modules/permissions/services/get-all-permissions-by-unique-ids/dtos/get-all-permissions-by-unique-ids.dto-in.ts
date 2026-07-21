export class GetAllPermissionsByUniqueIdsDtoIn {
  public readonly _ids: string[];

  constructor(_ids: string[]) {
    this._ids = _ids;

    if (!Array.isArray(this._ids) || this._ids.length === 0) {
      throw new Error('_ids is required');
    }

    for (const _id of this._ids) {
      if (_id.trim() === '') {
        throw new Error('_ids contains invalid value');
      }
    }
  }
}