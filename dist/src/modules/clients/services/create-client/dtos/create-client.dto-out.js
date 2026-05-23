"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientDtoOut = void 0;
class CreateClientDtoOut {
    id;
    _id;
    officeId;
    customerId;
    userType;
    username;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, officeId, customerId, userType, username, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.officeId = officeId;
        this.customerId = customerId;
        this.userType = userType;
        this.username = username;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateClientDtoOut(entity.id ?? 0, entity._id ?? '', entity.officeId, entity.customerId, entity.userType, entity.username, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateClientDtoOut = CreateClientDtoOut;
//# sourceMappingURL=create-client.dto-out.js.map