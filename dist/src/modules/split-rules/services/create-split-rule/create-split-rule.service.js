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
exports.CreateSplitRuleService = void 0;
const common_1 = require("@nestjs/common");
const split_rule_entity_1 = require("../../entities/split-rule.entity");
const split_rules_tokens_1 = require("../../tokens/split-rules.tokens");
const create_split_rule_dto_out_1 = require("./dtos/create-split-rule.dto-out");
let CreateSplitRuleService = class CreateSplitRuleService {
    splitRulesRepository;
    constructor(splitRulesRepository) {
        this.splitRulesRepository = splitRulesRepository;
    }
    async exec(dtoIn) {
        const existingSplitRule = await this.splitRulesRepository.findByOfficeIdAndSlug(dtoIn.officeId, dtoIn.slug);
        if (existingSplitRule !== null) {
            throw new Error('split rule slug already exists for this office');
        }
        const entity = new split_rule_entity_1.SplitRuleEntity(this.splitRulesRepository);
        entity.officeId = dtoIn.officeId;
        entity.clientId = dtoIn.clientId;
        entity.gatewayId = dtoIn.gatewayId;
        entity.name = dtoIn.name;
        entity.slug = dtoIn.slug;
        entity.description = dtoIn.description;
        entity.splitType = dtoIn.splitType;
        entity.calculationBase = dtoIn.calculationBase;
        entity.priority = dtoIn.priority;
        entity.metadata = dtoIn.metadata;
        entity.config = dtoIn.config;
        entity.changesHistory = [
            {
                source: 'CreateSplitRuleService',
                action: 'created',
                createdAt: new Date().toISOString(),
            },
        ];
        entity.status = dtoIn.status ?? 'active';
        const created = await entity.create();
        return new create_split_rule_dto_out_1.CreateSplitRuleDtoOut({
            id: created.id,
            _id: created._id,
            officeId: created.officeId,
            clientId: created.clientId,
            gatewayId: created.gatewayId,
            name: created.name,
            slug: created.slug,
            description: created.description,
            splitType: created.splitType,
            calculationBase: created.calculationBase,
            priority: created.priority,
            metadata: created.metadata,
            config: created.config,
            changesHistory: created.changesHistory,
            status: created.status,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }
};
exports.CreateSplitRuleService = CreateSplitRuleService;
exports.CreateSplitRuleService = CreateSplitRuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_rules_tokens_1.SPLIT_RULES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateSplitRuleService);
//# sourceMappingURL=create-split-rule.service.js.map