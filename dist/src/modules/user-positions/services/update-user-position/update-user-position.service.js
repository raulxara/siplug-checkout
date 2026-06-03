"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPositionService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const user_positions_tokens_1 = require("../../tokens/user-positions.tokens");
const update_user_position_dto_out_1 = require("./dtos/update-user-position.dto-out");
let UpdateUserPositionService = class UpdateUserPositionService {
    repository;
    buildChangesHistoryService;
    constructor(repository, buildChangesHistoryService) {
        this.repository = repository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        try {
            const currentRow = await this.repository.findByUniqueId(dtoIn._id);
            if (!currentRow) {
                throw new Error('user position not found');
            }
            const newDataForHistory = this.removeNullValues({
                userCustomerId: dtoIn.userCustomerId,
                positionId: dtoIn.positionId,
                config: dtoIn.config,
                status: dtoIn.status,
            });
            const historyDtoOut = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
                currentChangesHistory: currentRow.changesHistory,
                oldData: this.buildOldData(currentRow),
                newData: newDataForHistory,
                source: dtoIn.source,
            }));
            const row = await this.repository.updateByUniqueId(dtoIn._id, {
                user_customer_id: dtoIn.userCustomerId,
                position_id: dtoIn.positionId,
                config: dtoIn.config,
                changes_history: historyDtoOut.hasChanges
                    ? historyDtoOut.changesHistory
                    : currentRow.changesHistory,
                status: dtoIn.status,
            });
            return new update_user_position_dto_out_1.UpdateUserPositionDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update user position';
            throw new Error(message);
        }
    }
    removeNullValues(data) {
        return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
    }
    buildOldData(row) {
        return {
            userCustomerId: row.userCustomerId,
            positionId: row.positionId,
            config: row.config,
            status: row.status,
        };
    }
};
exports.UpdateUserPositionService = UpdateUserPositionService;
exports.UpdateUserPositionService = UpdateUserPositionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_positions_tokens_1.USER_POSITIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateUserPositionService);
//# sourceMappingURL=update-user-position.service.js.map