"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePermissionDtoOut = void 0;
class CreatePermissionDtoOut {
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
    static fromEntity(entity) {
        return new CreatePermissionDtoOut(entity.id ?? 0, entity._id ?? '', entity.officeId, entity.name, entity.slug, entity.description, entity.entity, entity.action, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreatePermissionDtoOut = CreatePermissionDtoOut;
//# sourceMappingURL=create-permission.dto-out.js.map