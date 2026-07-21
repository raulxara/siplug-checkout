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
exports.UpdateClientService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const hash_password_service_1 = require("../../../../common/services/security/hash-password.service");
const clients_tokens_1 = require("../../tokens/clients.tokens");
const update_client_dto_out_1 = require("./dtos/update-client.dto-out");
let UpdateClientService = class UpdateClientService {
    repository;
    buildChangesHistoryService;
    hashPasswordService;
    constructor(repository, buildChangesHistoryService, hashPasswordService) {
        this.repository = repository;
        this.buildChangesHistoryService = buildChangesHistoryService;
        this.hashPasswordService = hashPasswordService;
    }
    async exec(dtoIn) {
        try {
            const currentRow = await this.repository.findByUniqueId(dtoIn._id);
            if (!currentRow) {
                throw new Error('client not found');
            }
            let hashedPassword = null;
            if (dtoIn.password !== null && dtoIn.password.trim() !== '') {
                hashedPassword = await this.hashPasswordService.exec(dtoIn.password);
            }
            const newDataForHistory = this.removeNullValues({
                officeId: dtoIn.officeId,
                customerId: dtoIn.customerId,
                userType: dtoIn.userType,
                username: dtoIn.username,
                password: hashedPassword !== null ? '[updated]' : null,
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
                office_id: dtoIn.officeId,
                customer_id: dtoIn.customerId,
                user_type: dtoIn.userType,
                username: dtoIn.username,
                password: hashedPassword,
                config: dtoIn.config,
                changes_history: historyDtoOut.hasChanges
                    ? historyDtoOut.changesHistory
                    : currentRow.changesHistory,
                status: dtoIn.status,
            });
            return new update_client_dto_out_1.UpdateClientDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on update client';
            throw new Error(message);
        }
    }
    removeNullValues(data) {
        return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
    }
    buildOldData(row) {
        return {
            officeId: row.officeId,
            customerId: row.customerId,
            userType: row.userType,
            username: row.username,
            config: row.config,
            status: row.status,
        };
    }
};
exports.UpdateClientService = UpdateClientService;
exports.UpdateClientService = UpdateClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(clients_tokens_1.CLIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService,
        hash_password_service_1.HashPasswordService])
], UpdateClientService);
//# sourceMappingURL=update-client.service.js.map