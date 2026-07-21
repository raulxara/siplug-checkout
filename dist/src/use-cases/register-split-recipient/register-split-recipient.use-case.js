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
exports.RegisterSplitRecipientUseCase = void 0;
const common_1 = require("@nestjs/common");
const create_split_recipient_dto_in_1 = require("../../modules/split-recipients/services/create-split-recipient/dtos/create-split-recipient.dto-in");
const create_split_recipient_service_1 = require("../../modules/split-recipients/services/create-split-recipient/create-split-recipient.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_split_recipient_dto_out_1 = require("./dtos/register-split-recipient.dto-out");
let RegisterSplitRecipientUseCase = class RegisterSplitRecipientUseCase {
    createSplitRecipientService;
    resolveActorAuthorizationService;
    constructor(createSplitRecipientService, resolveActorAuthorizationService) {
        this.createSplitRecipientService = createSplitRecipientService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'splitRecipient',
            requiredAction: 'registerSplitRecipient',
        });
        const splitRecipientDtoOut = await this.createSplitRecipientService.exec(new create_split_recipient_dto_in_1.CreateSplitRecipientDtoIn(dtoIn.officeId, dtoIn.clientId, dtoIn.gatewayId, dtoIn.apiCredentialId, dtoIn.name, dtoIn.documentType, dtoIn.documentValue, dtoIn.email, dtoIn.gatewayProvider, dtoIn.gatewayRecipientId, dtoIn.gatewayAccountId, dtoIn.bankData, dtoIn.metadata, dtoIn.config, dtoIn.status));
        return new register_split_recipient_dto_out_1.RegisterSplitRecipientDtoOut(splitRecipientDtoOut.splitRecipient);
    }
};
exports.RegisterSplitRecipientUseCase = RegisterSplitRecipientUseCase;
exports.RegisterSplitRecipientUseCase = RegisterSplitRecipientUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [create_split_recipient_service_1.CreateSplitRecipientService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], RegisterSplitRecipientUseCase);
//# sourceMappingURL=register-split-recipient.use-case.js.map