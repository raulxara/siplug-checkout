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
exports.FindSplitRecipientByUniqueIdService = void 0;
const common_1 = require("@nestjs/common");
const split_recipients_tokens_1 = require("../../tokens/split-recipients.tokens");
const find_split_recipient_by_unique_id_dto_out_1 = require("./dtos/find-split-recipient-by-unique-id.dto-out");
let FindSplitRecipientByUniqueIdService = class FindSplitRecipientByUniqueIdService {
    splitRecipientsRepository;
    constructor(splitRecipientsRepository) {
        this.splitRecipientsRepository = splitRecipientsRepository;
    }
    async exec(dtoIn) {
        const splitRecipient = await this.splitRecipientsRepository.findByUniqueId(dtoIn.splitRecipientId);
        if (splitRecipient === null) {
            throw new Error('split recipient not found');
        }
        return new find_split_recipient_by_unique_id_dto_out_1.FindSplitRecipientByUniqueIdDtoOut(splitRecipient);
    }
};
exports.FindSplitRecipientByUniqueIdService = FindSplitRecipientByUniqueIdService;
exports.FindSplitRecipientByUniqueIdService = FindSplitRecipientByUniqueIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(split_recipients_tokens_1.SPLIT_RECIPIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindSplitRecipientByUniqueIdService);
//# sourceMappingURL=find-split-recipient-by-unique-id.service.js.map