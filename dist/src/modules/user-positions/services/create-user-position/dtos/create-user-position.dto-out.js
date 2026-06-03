"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserPositionDtoOut = void 0;
class CreateUserPositionDtoOut {
    id;
    _id;
    userCustomerId;
    positionId;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, userCustomerId, positionId, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.userCustomerId = userCustomerId;
        this.positionId = positionId;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateUserPositionDtoOut(entity.id ?? 0, entity._id ?? '', entity.userCustomerId, entity.positionId, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateUserPositionDtoOut = CreateUserPositionDtoOut;
//# sourceMappingURL=create-user-position.dto-out.js.map