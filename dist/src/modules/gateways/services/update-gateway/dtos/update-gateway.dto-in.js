"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGatewayDtoIn = void 0;
class UpdateGatewayDtoIn {
    _id;
    name;
    slug;
    provider;
    description;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.provider = params.provider ?? null;
        this.description = params.description ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateGatewayService';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateGatewayDtoIn = UpdateGatewayDtoIn;
//# sourceMappingURL=update-gateway.dto-in.js.map