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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSplitRuleUseCase = void 0;
const common_1 = require("@nestjs/common");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const find_split_rule_by_unique_id_dto_in_1 = require("../../modules/split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in");
const find_split_rule_by_unique_id_service_1 = require("../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service");
const update_split_rule_dto_in_1 = require("../../modules/split-rules/services/update-split-rule/dtos/update-split-rule.dto-in");
const update_split_rule_service_1 = require("../../modules/split-rules/services/update-split-rule/update-split-rule.service");
const update_split_rule_dto_out_1 = require("./dtos/update-split-rule.dto-out");
let UpdateSplitRuleUseCase = class UpdateSplitRuleUseCase {
    findSplitRuleByUniqueIdService;
    updateSplitRuleService;
    resolveActorAuthorizationService;
    constructor(findSplitRuleByUniqueIdService, updateSplitRuleService, resolveActorAuthorizationService) {
        this.findSplitRuleByUniqueIdService = findSplitRuleByUniqueIdService;
        this.updateSplitRuleService = updateSplitRuleService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRule',
            requiredAction: 'updateSplitRule',
        });
        await this.findSplitRuleByUniqueIdService.exec(new find_split_rule_by_unique_id_dto_in_1.FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId));
        const splitRuleDtoOut = await this.updateSplitRuleService.exec(new update_split_rule_dto_in_1.UpdateSplitRuleDtoIn(dtoIn.splitRuleId, dtoIn.officeId, dtoIn.clientId, dtoIn.gatewayId, dtoIn.name, dtoIn.slug, dtoIn.description, dtoIn.splitType, dtoIn.calculationBase, dtoIn.priority, dtoIn.metadata, dtoIn.config, dtoIn.status, 'UpdateSplitRuleUseCase'));
        return new update_split_rule_dto_out_1.UpdateSplitRuleDtoOut(splitRuleDtoOut.splitRule);
    }
};
exports.UpdateSplitRuleUseCase = UpdateSplitRuleUseCase;
exports.UpdateSplitRuleUseCase = UpdateSplitRuleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_split_rule_by_unique_id_service_1.FindSplitRuleByUniqueIdService,
        update_split_rule_service_1.UpdateSplitRuleService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], UpdateSplitRuleUseCase);
//# sourceMappingURL=update-split-rule.use-case.js.map