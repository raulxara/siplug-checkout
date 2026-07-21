"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterGatewayDtoOut = void 0;
class RegisterGatewayDtoOut {
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
    static fromCreateGatewayDtoOut(dtoOut) {
        return new RegisterGatewayDtoOut(dtoOut.id, dtoOut._id, dtoOut.name, dtoOut.slug, dtoOut.provider, dtoOut.description, dtoOut.config, dtoOut.changesHistory, dtoOut.status, dtoOut.createdAt, dtoOut.updatedAt);
    }
}
exports.RegisterGatewayDtoOut = RegisterGatewayDtoOut;
//# sourceMappingURL=register-gateway.dto-out.js.map