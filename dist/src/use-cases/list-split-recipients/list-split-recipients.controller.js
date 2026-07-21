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
exports.ListSplitRecipientsController = void 0;
const common_1 = require("@nestjs/common");
const list_split_recipients_dto_in_1 = require("./dtos/list-split-recipients.dto-in");
const list_split_recipients_request_1 = require("./http/list-split-recipients.request");
const list_split_recipients_use_case_1 = require("./list-split-recipients.use-case");
let ListSplitRecipientsController = class ListSplitRecipientsController {
    listSplitRecipientsUseCase;
    constructor(listSplitRecipientsUseCase) {
        this.listSplitRecipientsUseCase = listSplitRecipientsUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.listSplitRecipientsUseCase.exec(new list_split_recipients_dto_in_1.ListSplitRecipientsDtoIn({
            token: this.resolveToken(authorization, request.token),
        }));
        return {
            status: 'success',
            message: 'split recipients listed successfully',
            data: {
                splitRecipients: dtoOut.splitRecipients,
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
exports.ListSplitRecipientsController = ListSplitRecipientsController;
__decorate([
    (0, common_1.Post)('list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_split_recipients_request_1.ListSplitRecipientsRequest, String]),
    __metadata("design:returntype", Promise)
], ListSplitRecipientsController.prototype, "handle", null);
exports.ListSplitRecipientsController = ListSplitRecipientsController = __decorate([
    (0, common_1.Controller)('split-recipients'),
    __metadata("design:paramtypes", [list_split_recipients_use_case_1.ListSplitRecipientsUseCase])
], ListSplitRecipientsController);
//# sourceMappingURL=list-split-recipients.controller.js.map