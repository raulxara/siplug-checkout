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
exports.GetSplitRuleByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const find_split_rule_by_unique_id_dto_in_1 = require("../../modules/split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in");
const find_split_rule_by_unique_id_service_1 = require("../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service");
const get_split_rule_by_unique_id_dto_out_1 = require("./dtos/get-split-rule-by-unique-id.dto-out");
let GetSplitRuleByUniqueIdUseCase = class GetSplitRuleByUniqueIdUseCase {
    findSplitRuleByUniqueIdService;
    resolveActorAuthorizationService;
    constructor(findSplitRuleByUniqueIdService, resolveActorAuthorizationService) {
        this.findSplitRuleByUniqueIdService = findSplitRuleByUniqueIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRule',
            requiredAction: 'getSplitRuleByUniqueId',
        });
        const splitRuleDtoOut = await this.findSplitRuleByUniqueIdService.exec(new find_split_rule_by_unique_id_dto_in_1.FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId));
        return new get_split_rule_by_unique_id_dto_out_1.GetSplitRuleByUniqueIdDtoOut(splitRuleDtoOut.splitRule);
    }
};
exports.GetSplitRuleByUniqueIdUseCase = GetSplitRuleByUniqueIdUseCase;
exports.GetSplitRuleByUniqueIdUseCase = GetSplitRuleByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_split_rule_by_unique_id_service_1.FindSplitRuleByUniqueIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], GetSplitRuleByUniqueIdUseCase);
//# sourceMappingURL=get-split-rule-by-unique-id.use-case.js.map