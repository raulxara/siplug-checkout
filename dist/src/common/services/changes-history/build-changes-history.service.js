"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildChangesHistoryService = void 0;
const common_1 = require("@nestjs/common");
const format_date_time_util_1 = require("../../utils/format-date-time.util");
const build_changes_history_dto_out_1 = require("./dtos/build-changes-history.dto-out");
let BuildChangesHistoryService = class BuildChangesHistoryService {
    exec(dtoIn) {
        const currentChangesHistory = Array.isArray(dtoIn.currentChangesHistory)
            ? dtoIn.currentChangesHistory
            : [];
        const details = {};
        for (const [field, newValue] of Object.entries(dtoIn.newData)) {
            const oldValue = dtoIn.oldData[field] ?? null;
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                details[field] = {
                    old: oldValue,
                    new: newValue,
                };
            }
        }
        if (Object.keys(details).length === 0) {
            return new build_changes_history_dto_out_1.BuildChangesHistoryDtoOut({
                changesHistory: currentChangesHistory,
                details: {},
                hasChanges: false,
            });
        }
        const nextIndex = currentChangesHistory.length + 1;
        const actionKey = `action${nextIndex}`;
        const newHistoryItem = {
            [actionKey]: 'update',
            source: dtoIn.source,
            details,
            updated_at: (0, format_date_time_util_1.formatDateTime)(new Date()),
        };
        return new build_changes_history_dto_out_1.BuildChangesHistoryDtoOut({
            changesHistory: [...currentChangesHistory, newHistoryItem],
            details,
            hasChanges: true,
        });
    }
};
exports.BuildChangesHistoryService = BuildChangesHistoryService;
exports.BuildChangesHistoryService = BuildChangesHistoryService = __decorate([
    (0, common_1.Injectable)()
], BuildChangesHistoryService);
//# sourceMappingURL=build-changes-history.service.js.map