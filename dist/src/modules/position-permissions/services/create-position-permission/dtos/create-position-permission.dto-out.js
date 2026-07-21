"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePositionPermissionDtoOut = void 0;
class CreatePositionPermissionDtoOut {
    id;
    _id;
    positionId;
    permissionId;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, positionId, permissionId, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.positionId = positionId;
        this.permissionId = permissionId;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreatePositionPermissionDtoOut(entity.id ?? 0, entity._id ?? '', entity.positionId, entity.permissionId, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreatePositionPermissionDtoOut = CreatePositionPermissionDtoOut;
//# sourceMappingURL=create-position-permission.dto-out.js.map