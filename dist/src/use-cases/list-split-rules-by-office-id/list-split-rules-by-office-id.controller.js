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
exports.ListSplitRulesByOfficeIdController = void 0;
const common_1 = require("@nestjs/common");
const list_split_rules_by_office_id_dto_in_1 = require("./dtos/list-split-rules-by-office-id.dto-in");
const list_split_rules_by_office_id_request_1 = require("./http/list-split-rules-by-office-id.request");
const list_split_rules_by_office_id_use_case_1 = require("./list-split-rules-by-office-id.use-case");
let ListSplitRulesByOfficeIdController = class ListSplitRulesByOfficeIdController {
    listSplitRulesByOfficeIdUseCase;
    constructor(listSplitRulesByOfficeIdUseCase) {
        this.listSplitRulesByOfficeIdUseCase = listSplitRulesByOfficeIdUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.listSplitRulesByOfficeIdUseCase.exec(new list_split_rules_by_office_id_dto_in_1.ListSplitRulesByOfficeIdDtoIn({
            token: this.resolveToken(authorization, request.token),
            officeId: request.officeId,
        }));
        return {
            status: 'success',
            message: 'split rules listed by office successfully',
            data: {
                splitRules: dtoOut.splitRules,
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
exports.ListSplitRulesByOfficeIdController = ListSplitRulesByOfficeIdController;
__decorate([
    (0, common_1.Post)('list-by-office-id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_split_rules_by_office_id_request_1.ListSplitRulesByOfficeIdRequest, String]),
    __metadata("design:returntype", Promise)
], ListSplitRulesByOfficeIdController.prototype, "handle", null);
exports.ListSplitRulesByOfficeIdController = ListSplitRulesByOfficeIdController = __decorate([
    (0, common_1.Controller)('split-rules'),
    __metadata("design:paramtypes", [list_split_rules_by_office_id_use_case_1.ListSplitRulesByOfficeIdUseCase])
], ListSplitRulesByOfficeIdController);
//# sourceMappingURL=list-split-rules-by-office-id.controller.js.map