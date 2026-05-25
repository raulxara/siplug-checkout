"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPositionDtoOut = void 0;
class RegisterPositionDtoOut {
    id;
    _id;
    officeId;
    name;
    slug;
    description;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, officeId, name, slug, description, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.officeId = officeId;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromCreatePositionDtoOut(dtoOut) {
        return new RegisterPositionDtoOut(dtoOut.id, dtoOut._id, dtoOut.officeId, dtoOut.name, dtoOut.slug, dtoOut.description, dtoOut.config, dtoOut.changesHistory, dtoOut.status, dtoOut.createdAt, dtoOut.updatedAt);
    }
}
exports.RegisterPositionDtoOut = RegisterPositionDtoOut;
//# sourceMappingURL=register-position.dto-out.js.map