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
exports.UpdateSplitRuleController = void 0;
const common_1 = require("@nestjs/common");
const update_split_rule_dto_in_1 = require("./dtos/update-split-rule.dto-in");
const update_split_rule_request_1 = require("./http/update-split-rule.request");
const update_split_rule_use_case_1 = require("./update-split-rule.use-case");
let UpdateSplitRuleController = class UpdateSplitRuleController {
    updateSplitRuleUseCase;
    constructor(updateSplitRuleUseCase) {
        this.updateSplitRuleUseCase = updateSplitRuleUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.updateSplitRuleUseCase.exec(new update_split_rule_dto_in_1.UpdateSplitRuleDtoIn({
            token: this.resolveToken(authorization, request.token),
            splitRuleId: request.splitRuleId ?? request._id,
            officeId: request.officeId,
            clientId: request.clientId,
            gatewayId: request.gatewayId,
            name: request.name,
            slug: request.slug,
            description: request.description,
            splitType: request.splitType,
            calculationBase: request.calculationBase,
            priority: request.priority,
            metadata: request.metadata,
            config: request.config,
            status: request.status,
        }));
        return {
            status: 'success',
            message: 'split rule updated successfully',
            data: {
                splitRule: dtoOut.splitRule,
            },
        };
    }
    resolveToken(authorization, fallbackToken) {
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '').trim();
        }
        return String(fallbackToken ?? '').trim();
    }
};
exports.UpdateSplitRuleController = UpdateSplitRuleController;
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_split_rule_request_1.UpdateSplitRuleRequest, String]),
    __metadata("design:returntype", Promise)
], UpdateSplitRuleController.prototype, "handle", null);
exports.UpdateSplitRuleController = UpdateSplitRuleController = __decorate([
    (0, common_1.Controller)('split-rules'),
    __metadata("design:paramtypes", [update_split_rule_use_case_1.UpdateSplitRuleUseCase])
], UpdateSplitRuleController);
//# sourceMappingURL=update-split-rule.controller.js.map