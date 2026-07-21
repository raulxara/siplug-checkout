"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionByUniqueIdDtoIn = void 0;
class UpdatePositionByUniqueIdDtoIn {
    positionId;
    data;
    constructor(params) {
        this.positionId = String(params.positionId ?? params._id ?? '').trim();
        if (this.positionId === '') {
            throw new Error('positionId is required');
        }
        if (!params.data || typeof params.data !== 'object' || Array.isArray(params.data)) {
            throw new Error('data is required');
        }
        this.data = params.data;
    }
}
exports.UpdatePositionByUniqueIdDtoIn = UpdatePositionByUniqueIdDtoIn;
//# sourceMappingURL=update-position-by-unique-id.dto-in.js.map