"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePositionDtoOut = void 0;
class CreatePositionDtoOut {
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
    static fromEntity(entity) {
        return new CreatePositionDtoOut(entity.id ?? 0, entity._id ?? '', entity.officeId, entity.name, entity.slug, entity.description, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreatePositionDtoOut = CreatePositionDtoOut;
//# sourceMappingURL=create-position.dto-out.js.map