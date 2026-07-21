"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPermissionDtoOut = void 0;
class RegisterPermissionDtoOut {
    id;
    _id;
    officeId;
    name;
    slug;
    description;
    entity;
    action;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, officeId, name, slug, description, entity, action, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.officeId = officeId;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.entity = entity;
        this.action = action;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromCreatePermissionDtoOut(dtoOut) {
        return new RegisterPermissionDtoOut(dtoOut.id, dtoOut._id, dtoOut.officeId, dtoOut.name, dtoOut.slug, dtoOut.description, dtoOut.entity, dtoOut.action, dtoOut.config, dtoOut.changesHistory, dtoOut.status, dtoOut.createdAt, dtoOut.updatedAt);
    }
}
exports.RegisterPermissionDtoOut = RegisterPermissionDtoOut;
//# sourceMappingURL=register-permission.dto-out.js.map