"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserAccessCodeDtoOut = void 0;
class CreateUserAccessCodeDtoOut {
    id;
    _id;
    userCustomerId;
    channel;
    destination;
    code;
    expiresAt;
    usedAt;
    sentAt;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, userCustomerId, channel, destination, code, expiresAt, usedAt, sentAt, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.userCustomerId = userCustomerId;
        this.channel = channel;
        this.destination = destination;
        this.code = code;
        this.expiresAt = expiresAt;
        this.usedAt = usedAt;
        this.sentAt = sentAt;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateUserAccessCodeDtoOut(entity.id ?? 0, entity._id ?? '', entity.userCustomerId, entity.channel, entity.destination, entity.code, entity.expiresAt, entity.usedAt, entity.sentAt, entity.config, entity.changesHistory, entity.status ?? 'created', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateUserAccessCodeDtoOut = CreateUserAccessCodeDtoOut;
//# sourceMappingURL=create-user-access-code.dto-out.js.map