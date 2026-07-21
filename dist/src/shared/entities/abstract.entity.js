"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEntity = void 0;
class AbstractEntity {
    id = null;
    _id = null;
    createdAt = null;
    updatedAt = null;
    status = null;
    hydrate(data) {
        for (const [key, value] of Object.entries(data)) {
            if (key in this) {
                this[key] = value;
            }
        }
        return this;
    }
}
exports.AbstractEntity = AbstractEntity;
//# sourceMappingURL=abstract.entity.js.map