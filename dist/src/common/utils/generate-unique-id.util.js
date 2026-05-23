"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = generateUniqueId;
const crypto_1 = require("crypto");
function generateUniqueId() {
    return (0, crypto_1.randomUUID)();
}
//# sourceMappingURL=generate-unique-id.util.js.map