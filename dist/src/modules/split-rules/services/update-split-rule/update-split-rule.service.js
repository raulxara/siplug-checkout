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
exports.UpdateSplitRuleService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const split_rules_tokens_1 = require("../../tokens/split-rules.tokens");
const update_split_rule_dto_out_1 = require("./dtos/update-split-rule.dto-out");
let UpdateSplitRuleService = class UpdateSplitRuleService {
    splitRulesRepository;
    buildChangesHistoryService;
    constructor(splitRulesRepository, buildChangesHistoryService) {
        this.splitRulesRepository = splitRulesRepository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        const current = await this.splitRulesRepository.findByUniqueId(dtoIn._id);
        if (current === null) {
            throw new Error('split rule not found');
        }
        if (dtoIn.slug !== null) {
            const existingBySlug = await this.splitRulesRepository.findByOfficeIdAndSlug(current.officeId, dtoIn.slug);
            if (existingBySlug !== null && existingBySlug._id !== dtoIn._id) {
                throw new Error('split rule slug already exists for this office');
            }
        }
        const newDataForHistory = this.buildNewDataForHistory(dtoIn);
        const changesHistory = this.buildChangesHistoryService.exec({
            currentChangesHistory: current.changesHistory ?? null,
            oldData: current,
            newData: newDataForHistory,
            source: dtoIn.source,
        });
        const updated = await this.splitRulesRepository.updateByUniqueId(dtoIn._id, {
            office_id: dtoIn.officeId,
            client_id: dtoIn.clientId,
            gateway_id: dtoIn.gatewayId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            description: dtoIn.description,
            split_type: dtoIn.splitType,
            calculation_base: dtoIn.calculationBase,
            priority: dtoIn.priority,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            changes_history: changesHistory,
            status: dtoIn.status,
        });
        return new update_split_rule_dto_out_1.UpdateSplitRuleDtoOut(updated);
    }
    buildNewDataForHistory(dtoIn) {
        const newData = {};
        this.addIfNotNull(newData, 'officeId', dtoIn.officeId);
        this.addIfNotNull(newData, 'clientId', dtoIn.clientId);
        this.addIfNotNull(newData, 'gatewayId', dtoIn.gatewayId);
        this.addIfNotNull(newData, 'name', dtoIn.name);
        this.addIfNotNull(newData, 'slug', dtoIn.slug);
        this.addIfNotNull(newData, 'description', dtoIn.description);
        this.addIfNotNull(newData, 'splitType', dtoIn.splitType);
        this.addIfNotNull(newData, 'calculationBase', dtoIn.calculationBase);
        this.addIfNotNull(newData, 'priority', dtoIn.priority);
        this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
        this.addIfNotNull(newData, 'config', dtoIn.config);
        this.addIfNotNull(newData, 'status', dtoIn.status);
        return newData;
    }
    addIfNotNull(target, key, value) {
        if (value !== null && value !== undefined) {
            target[key] = value;
        }
    }
};
exports.UpdateSplitRuleService = UpdateSplitRuleService;
exports.UpdateSplitRuleService = UpdateSplitRuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_rules_tokens_1.SPLIT_RULES_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateSplitRuleService);
//# sourceMappingURL=update-split-rule.service.js.map