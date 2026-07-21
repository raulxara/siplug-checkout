"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGatewayDtoOut = void 0;
class CreateGatewayDtoOut {
    id;
    _id;
    name;
    slug;
    provider;
    description;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, name, slug, provider, description, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.name = name;
        this.slug = slug;
        this.provider = provider;
        this.description = description;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateGatewayDtoOut(entity.id ?? 0, entity._id ?? '', entity.name, entity.slug, entity.provider, entity.description, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateGatewayDtoOut = CreateGatewayDtoOut;
//# sourceMappingURL=create-gateway.dto-out.js.map