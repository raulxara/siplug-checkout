"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSplitRulesDtoIn = void 0;
class ListSplitRulesDtoIn {
    token;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
    }
}
exports.ListSplitRulesDtoIn = ListSplitRulesDtoIn;
//# sourceMappingURL=list-split-rules.dto-in.js.map