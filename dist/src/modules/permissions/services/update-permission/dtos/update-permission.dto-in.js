"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermissionDtoIn = void 0;
class UpdatePermissionDtoIn {
    _id;
    officeId;
    name;
    slug;
    description;
    entity;
    action;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.officeId = params.officeId ?? null;
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.description = params.description ?? null;
        this.entity = params.entity ?? null;
        this.action = params.action ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdatePermissionDtoIn = UpdatePermissionDtoIn;
//# sourceMappingURL=update-permission.dto-in.js.map