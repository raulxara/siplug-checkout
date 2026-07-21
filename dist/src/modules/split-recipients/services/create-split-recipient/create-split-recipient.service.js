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
exports.CreateSplitRecipientService = void 0;
const common_1 = require("@nestjs/common");
const split_recipient_entity_1 = require("../../entities/split-recipient.entity");
const split_recipients_tokens_1 = require("../../tokens/split-recipients.tokens");
const create_split_recipient_dto_out_1 = require("./dtos/create-split-recipient.dto-out");
let CreateSplitRecipientService = class CreateSplitRecipientService {
    splitRecipientsRepository;
    constructor(splitRecipientsRepository) {
        this.splitRecipientsRepository = splitRecipientsRepository;
    }
    async exec(dtoIn) {
        const entity = new split_recipient_entity_1.SplitRecipientEntity(this.splitRecipientsRepository);
        entity.officeId = dtoIn.officeId;
        entity.clientId = dtoIn.clientId;
        entity.gatewayId = dtoIn.gatewayId;
        entity.apiCredentialId = dtoIn.apiCredentialId;
        entity.name = dtoIn.name;
        entity.documentType = dtoIn.documentType;
        entity.documentValue = dtoIn.documentValue;
        entity.email = dtoIn.email;
        entity.gatewayProvider = dtoIn.gatewayProvider;
        entity.gatewayRecipientId = dtoIn.gatewayRecipientId;
        entity.gatewayAccountId = dtoIn.gatewayAccountId;
        entity.bankData = dtoIn.bankData;
        entity.metadata = dtoIn.metadata;
        entity.config = dtoIn.config;
        entity.changesHistory = [
            {
                source: 'CreateSplitRecipientService',
                action: 'created',
                createdAt: new Date().toISOString(),
            },
        ];
        entity.status = dtoIn.status ?? 'active';
        const created = await entity.create();
        return new create_split_recipient_dto_out_1.CreateSplitRecipientDtoOut({
            id: created.id,
            _id: created._id,
            officeId: created.officeId,
            clientId: created.clientId,
            gatewayId: created.gatewayId,
            apiCredentialId: created.apiCredentialId,
            name: created.name,
            documentType: created.documentType,
            documentValue: created.documentValue,
            email: created.email,
            gatewayProvider: created.gatewayProvider,
            gatewayRecipientId: created.gatewayRecipientId,
            gatewayAccountId: created.gatewayAccountId,
            bankData: created.bankData,
            metadata: created.metadata,
            config: created.config,
            changesHistory: created.changesHistory,
            status: created.status,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }
};
exports.CreateSplitRecipientService = CreateSplitRecipientService;
exports.CreateSplitRecipientService = CreateSplitRecipientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_recipients_tokens_1.SPLIT_RECIPIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateSplitRecipientService);
//# sourceMappingURL=create-split-recipient.service.js.map