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
exports.UpdateCheckoutSessionItemService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const checkout_sessions_tokens_1 = require("../../tokens/checkout-sessions.tokens");
const update_checkout_session_item_dto_out_1 = require("./dtos/update-checkout-session-item.dto-out");
let UpdateCheckoutSessionItemService = class UpdateCheckoutSessionItemService {
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
                throw new Error('checkout session item not found');
            }
            const newDataForHistory = this.removeNullValues({
                checkoutSessionId: dtoIn.checkoutSessionId,
                itemRef: dtoIn.itemRef,
                itemType: dtoIn.itemType,
                name: dtoIn.name,
                description: dtoIn.description,
                quantity: dtoIn.quantity,
                unitAmount: dtoIn.unitAmount,
                totalAmount: dtoIn.totalAmount,
                metadata: dtoIn.metadata,
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
                checkout_session_id: dtoIn.checkoutSessionId,
                item_ref: dtoIn.itemRef,
                item_type: dtoIn.itemType,
                name: dtoIn.name,
                description: dtoIn.description,
                quantity: dtoIn.quantity,
                unit_amount: dtoIn.unitAmount,
                total_amount: dtoIn.totalAmount,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                changes_history: historyDtoOut.hasChanges
                    ? historyDtoOut.changesHistory
                    : currentRow.changesHistory,
                status: dtoIn.status,
            });
            return new update_checkout_session_item_dto_out_1.UpdateCheckoutSessionItemDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update checkout session item';
            throw new Error(message);
        }
    }
    removeNullValues(data) {
        return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
    }
    buildOldData(row) {
        return {
            checkoutSessionId: row.checkoutSessionId,
            itemRef: row.itemRef,
            itemType: row.itemType,
            name: row.name,
            description: row.description,
            quantity: row.quantity,
            unitAmount: row.unitAmount,
            totalAmount: row.totalAmount,
            metadata: row.metadata,
            config: row.config,
            status: row.status,
        };
    }
};
exports.UpdateCheckoutSessionItemService = UpdateCheckoutSessionItemService;
exports.UpdateCheckoutSessionItemService = UpdateCheckoutSessionItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(checkout_sessions_tokens_1.CHECKOUT_SESSION_ITEMS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateCheckoutSessionItemService);
//# sourceMappingURL=update-checkout-session-item.service.js.map