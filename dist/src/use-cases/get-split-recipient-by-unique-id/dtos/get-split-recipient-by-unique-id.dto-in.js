"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSplitRecipientByUniqueIdDtoIn = void 0;
class GetSplitRecipientByUniqueIdDtoIn {
    token;
    splitRecipientId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.splitRecipientId = String(params.splitRecipientId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.splitRecipientId === '') {
            throw new Error('splitRecipientId is required');
        }
    }
}
exports.GetSplitRecipientByUniqueIdDtoIn = GetSplitRecipientByUniqueIdDtoIn;
//# sourceMappingURL=get-split-recipient-by-unique-id.dto-in.js.map