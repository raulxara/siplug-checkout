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
exports.ListSplitRecipientsUseCase = void 0;
const common_1 = require("@nestjs/common");
const get_all_split_recipients_service_1 = require("../../modules/split-recipients/services/get-all-split-recipients/get-all-split-recipients.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const list_split_recipients_dto_out_1 = require("./dtos/list-split-recipients.dto-out");
let ListSplitRecipientsUseCase = class ListSplitRecipientsUseCase {
    getAllSplitRecipientsService;
    resolveActorAuthorizationService;
    constructor(getAllSplitRecipientsService, resolveActorAuthorizationService) {
        this.getAllSplitRecipientsService = getAllSplitRecipientsService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRecipient',
            requiredAction: 'listSplitRecipients',
        });
        const splitRecipientsDtoOut = await this.getAllSplitRecipientsService.exec();
        return new list_split_recipients_dto_out_1.ListSplitRecipientsDtoOut(splitRecipientsDtoOut.splitRecipients);
    }
};
exports.ListSplitRecipientsUseCase = ListSplitRecipientsUseCase;
exports.ListSplitRecipientsUseCase = ListSplitRecipientsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_all_split_recipients_service_1.GetAllSplitRecipientsService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], ListSplitRecipientsUseCase);
//# sourceMappingURL=list-split-recipients.use-case.js.map