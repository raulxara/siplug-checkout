"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionDtoIn = void 0;
class UpdatePositionDtoIn {
    _id;
    officeId;
    name;
    slug;
    description;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.officeId = params.officeId ?? null;
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.description = params.description ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdatePositionDtoIn = UpdatePositionDtoIn;
//# sourceMappingURL=update-position.dto-in.js.map