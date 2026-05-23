"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildChangesHistoryDtoIn = void 0;
class BuildChangesHistoryDtoIn {
    currentChangesHistory;
    oldData;
    newData;
    source;
    constructor(params) {
        this.currentChangesHistory = params.currentChangesHistory ?? null;
        this.oldData = params.oldData;
        this.newData = params.newData;
        this.source = params.source ?? 'system';
    }
}
exports.BuildChangesHistoryDtoIn = BuildChangesHistoryDtoIn;
//# sourceMappingURL=build-changes-history.dto-in.js.map