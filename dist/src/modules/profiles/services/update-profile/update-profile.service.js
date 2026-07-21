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
exports.UpdateProfileService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const profiles_tokens_1 = require("../../tokens/profiles.tokens");
const update_profile_dto_out_1 = require("./dtos/update-profile.dto-out");
let UpdateProfileService = class UpdateProfileService {
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
                throw new Error('profile not found');
            }
            const newDataForHistory = this.removeNullValues({
                firstName: dtoIn.firstName,
                lastName: dtoIn.lastName,
                email: dtoIn.email,
                phone: dtoIn.phone,
                documentType: dtoIn.documentType,
                documentValue: dtoIn.documentValue,
                addressStreet: dtoIn.addressStreet,
                addressNumber: dtoIn.addressNumber,
                addressComplement: dtoIn.addressComplement,
                addressNeighborhood: dtoIn.addressNeighborhood,
                addressCity: dtoIn.addressCity,
                addressState: dtoIn.addressState,
                addressCountry: dtoIn.addressCountry,
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
                first_name: dtoIn.firstName,
                last_name: dtoIn.lastName,
                email: dtoIn.email,
                phone: dtoIn.phone,
                document_type: dtoIn.documentType,
                document_value: dtoIn.documentValue,
                address_street: dtoIn.addressStreet,
                address_number: dtoIn.addressNumber,
                address_complement: dtoIn.addressComplement,
                address_neighborhood: dtoIn.addressNeighborhood,
                address_city: dtoIn.addressCity,
                address_state: dtoIn.addressState,
                address_country: dtoIn.addressCountry,
                config: dtoIn.config,
                changes_history: historyDtoOut.hasChanges
                    ? historyDtoOut.changesHistory
                    : currentRow.changesHistory,
                status: dtoIn.status,
            });
            return new update_profile_dto_out_1.UpdateProfileDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on update profile';
            throw new Error(message);
        }
    }
    removeNullValues(data) {
        return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
    }
    buildOldData(row) {
        return {
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            phone: row.phone,
            documentType: row.documentType,
            documentValue: row.documentValue,
            addressStreet: row.addressStreet,
            addressNumber: row.addressNumber,
            addressComplement: row.addressComplement,
            addressNeighborhood: row.addressNeighborhood,
            addressCity: row.addressCity,
            addressState: row.addressState,
            addressCountry: row.addressCountry,
            config: row.config,
            status: row.status,
        };
    }
};
exports.UpdateProfileService = UpdateProfileService;
exports.UpdateProfileService = UpdateProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(profiles_tokens_1.PROFILES_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateProfileService);
//# sourceMappingURL=update-profile.service.js.map