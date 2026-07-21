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
exports.RegisterSplitRecipientController = void 0;
const common_1 = require("@nestjs/common");
const register_split_recipient_dto_in_1 = require("./dtos/register-split-recipient.dto-in");
const register_split_recipient_request_1 = require("./http/register-split-recipient.request");
const register_split_recipient_use_case_1 = require("./register-split-recipient.use-case");
let RegisterSplitRecipientController = class RegisterSplitRecipientController {
    registerSplitRecipientUseCase;
    constructor(registerSplitRecipientUseCase) {
        this.registerSplitRecipientUseCase = registerSplitRecipientUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.registerSplitRecipientUseCase.exec(new register_split_recipient_dto_in_1.RegisterSplitRecipientDtoIn({
            token: this.resolveToken(authorization, request.token),
            officeId: request.officeId,
            clientId: request.clientId,
            gatewayId: request.gatewayId,
            apiCredentialId: request.apiCredentialId,
            name: request.name,
            documentType: request.documentType,
            documentValue: request.documentValue,
            email: request.email,
            gatewayProvider: request.gatewayProvider,
            gatewayRecipientId: request.gatewayRecipientId,
            gatewayAccountId: request.gatewayAccountId,
            bankData: request.bankData,
            metadata: request.metadata,
            config: request.config,
            status: request.status,
        }));
        return {
            status: 'success',
            message: 'split recipient registered successfully',
            data: {
                splitRecipient: dtoOut.splitRecipient,
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
exports.RegisterSplitRecipientController = RegisterSplitRecipientController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_split_recipient_request_1.RegisterSplitRecipientRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterSplitRecipientController.prototype, "handle", null);
exports.RegisterSplitRecipientController = RegisterSplitRecipientController = __decorate([
    (0, common_1.Controller)('split-recipients'),
    __metadata("design:paramtypes", [register_split_recipient_use_case_1.RegisterSplitRecipientUseCase])
], RegisterSplitRecipientController);
//# sourceMappingURL=register-split-recipient.controller.js.map