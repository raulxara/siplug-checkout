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
exports.RegisterSplitRuleUseCase = void 0;
const common_1 = require("@nestjs/common");
const create_split_rule_dto_in_1 = require("../../modules/split-rules/services/create-split-rule/dtos/create-split-rule.dto-in");
const create_split_rule_service_1 = require("../../modules/split-rules/services/create-split-rule/create-split-rule.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_split_rule_dto_out_1 = require("./dtos/register-split-rule.dto-out");
let RegisterSplitRuleUseCase = class RegisterSplitRuleUseCase {
    createSplitRuleService;
    resolveActorAuthorizationService;
    constructor(createSplitRuleService, resolveActorAuthorizationService) {
        this.createSplitRuleService = createSplitRuleService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRule',
            requiredAction: 'registerSplitRule',
        });
        const splitRuleDtoOut = await this.createSplitRuleService.exec(new create_split_rule_dto_in_1.CreateSplitRuleDtoIn(dtoIn.officeId, dtoIn.clientId, dtoIn.gatewayId, dtoIn.name, dtoIn.slug, dtoIn.description, dtoIn.splitType, dtoIn.calculationBase, dtoIn.priority, dtoIn.metadata, dtoIn.config, dtoIn.status));
        return new register_split_rule_dto_out_1.RegisterSplitRuleDtoOut(splitRuleDtoOut.splitRule);
    }
};
exports.RegisterSplitRuleUseCase = RegisterSplitRuleUseCase;
exports.RegisterSplitRuleUseCase = RegisterSplitRuleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [create_split_rule_service_1.CreateSplitRuleService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], RegisterSplitRuleUseCase);
//# sourceMappingURL=register-split-rule.use-case.js.map