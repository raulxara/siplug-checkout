"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSplitRecipientByUniqueIdDtoIn = void 0;
class FindSplitRecipientByUniqueIdDtoIn {
    splitRecipientId;
    constructor(splitRecipientId) {
        this.splitRecipientId = String(splitRecipientId ?? '').trim();
        if (this.splitRecipientId === '') {
            throw new Error('splitRecipientId is required');
        }
    }
}
exports.FindSplitRecipientByUniqueIdDtoIn = FindSplitRecipientByUniqueIdDtoIn;
//# sourceMappingURL=find-split-recipient-by-unique-id.dto-in.js.map