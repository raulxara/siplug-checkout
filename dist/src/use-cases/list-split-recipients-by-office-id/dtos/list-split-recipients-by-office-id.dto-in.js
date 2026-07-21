"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSplitRecipientsByOfficeIdDtoIn = void 0;
class ListSplitRecipientsByOfficeIdDtoIn {
    token;
    officeId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.officeId = String(params.officeId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListSplitRecipientsByOfficeIdDtoIn = ListSplitRecipientsByOfficeIdDtoIn;
//# sourceMappingURL=list-split-recipients-by-office-id.dto-in.js.map