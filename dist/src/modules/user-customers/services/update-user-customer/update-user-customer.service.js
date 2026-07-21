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
exports.UpdateUserCustomerService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const user_customers_tokens_1 = require("../../tokens/user-customers.tokens");
const update_user_customer_dto_out_1 = require("./dtos/update-user-customer.dto-out");
let UpdateUserCustomerService = class UpdateUserCustomerService {
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
                throw new Error('user customer not found');
            }
            const newDataForHistory = this.removeNullValues({
                clientId: dtoIn.clientId,
                profileId: dtoIn.profileId,
                token: dtoIn.token,
                twoFaRequired: dtoIn.twoFaRequired,
                twoFaActive: dtoIn.twoFaActive,
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
                client_id: dtoIn.clientId,
                profile_id: dtoIn.profileId,
                token: dtoIn.token,
                two_fa_required: dtoIn.twoFaRequired,
                two_fa_active: dtoIn.twoFaActive,
                config: dtoIn.config,
                changes_history: historyDtoOut.hasChanges
                    ? historyDtoOut.changesHistory
                    : currentRow.changesHistory,
                status: dtoIn.status,
            });
            return new update_user_customer_dto_out_1.UpdateUserCustomerDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update user customer';
            throw new Error(message);
        }
    }
    removeNullValues(data) {
        return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
    }
    buildOldData(row) {
        return {
            clientId: row.clientId,
            profileId: row.profileId,
            token: row.token,
            twoFaRequired: row.twoFaRequired,
            twoFaActive: row.twoFaActive,
            config: row.config,
            status: row.status,
        };
    }
};
exports.UpdateUserCustomerService = UpdateUserCustomerService;
exports.UpdateUserCustomerService = UpdateUserCustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_customers_tokens_1.USER_CUSTOMERS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateUserCustomerService);
//# sourceMappingURL=update-user-customer.service.js.map