"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSplitRecipientsDtoIn = void 0;
class ListSplitRecipientsDtoIn {
    token;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
    }
}
exports.ListSplitRecipientsDtoIn = ListSplitRecipientsDtoIn;
//# sourceMappingURL=list-split-recipients.dto-in.js.map