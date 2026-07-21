"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPositionPermissionsByPositionIdsDtoIn = void 0;
class GetAllPositionPermissionsByPositionIdsDtoIn {
    positionIds;
    constructor(positionIds) {
        this.positionIds = positionIds;
        if (!Array.isArray(this.positionIds) || this.positionIds.length === 0) {
            throw new Error('positionIds is required');
        }
        for (const positionId of this.positionIds) {
            if (positionId.trim() === '') {
                throw new Error('positionIds contains invalid value');
            }
        }
    }
}
exports.GetAllPositionPermissionsByPositionIdsDtoIn = GetAllPositionPermissionsByPositionIdsDtoIn;
//# sourceMappingURL=get-all-position-permissions-by-position-ids.dto-in.js.map