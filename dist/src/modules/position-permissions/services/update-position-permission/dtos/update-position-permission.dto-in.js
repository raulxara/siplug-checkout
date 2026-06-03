"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionPermissionDtoIn = void 0;
class UpdatePositionPermissionDtoIn {
    _id;
    positionId;
    permissionId;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.positionId = params.positionId ?? null;
        this.permissionId = params.permissionId ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdatePositionPermissionDtoIn = UpdatePositionPermissionDtoIn;
//# sourceMappingURL=update-position-permission.dto-in.js.map