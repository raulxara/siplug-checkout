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
exports.ListSplitRulesByOfficeIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_all_split_rules_by_office_id_dto_in_1 = require("../../modules/split-rules/services/get-all-split-rules-by-office-id/dtos/get-all-split-rules-by-office-id.dto-in");
const get_all_split_rules_by_office_id_service_1 = require("../../modules/split-rules/services/get-all-split-rules-by-office-id/get-all-split-rules-by-office-id.service");
const list_split_rules_by_office_id_dto_out_1 = require("./dtos/list-split-rules-by-office-id.dto-out");
let ListSplitRulesByOfficeIdUseCase = class ListSplitRulesByOfficeIdUseCase {
    getAllSplitRulesByOfficeIdService;
    resolveActorAuthorizationService;
    constructor(getAllSplitRulesByOfficeIdService, resolveActorAuthorizationService) {
        this.getAllSplitRulesByOfficeIdService = getAllSplitRulesByOfficeIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRule',
            requiredAction: 'listSplitRulesByOfficeId',
        });
        const splitRulesDtoOut = await this.getAllSplitRulesByOfficeIdService.exec(new get_all_split_rules_by_office_id_dto_in_1.GetAllSplitRulesByOfficeIdDtoIn(dtoIn.officeId));
        return new list_split_rules_by_office_id_dto_out_1.ListSplitRulesByOfficeIdDtoOut(splitRulesDtoOut.splitRules);
    }
};
exports.ListSplitRulesByOfficeIdUseCase = ListSplitRulesByOfficeIdUseCase;
exports.ListSplitRulesByOfficeIdUseCase = ListSplitRulesByOfficeIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_all_split_rules_by_office_id_service_1.GetAllSplitRulesByOfficeIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], ListSplitRulesByOfficeIdUseCase);
//# sourceMappingURL=list-split-rules-by-office-id.use-case.js.map