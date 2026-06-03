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
exports.CreateApiCredentialService = void 0;
const common_1 = require("@nestjs/common");
const api_credential_entity_1 = require("../../entities/api-credential.entity");
const api_credentials_tokens_1 = require("../../tokens/api-credentials.tokens");
const create_api_credential_dto_out_1 = require("./dtos/create-api-credential.dto-out");
let CreateApiCredentialService = class CreateApiCredentialService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new api_credential_entity_1.ApiCredentialEntity(this.repository);
            entity.officeId = dtoIn.officeId;
            entity.clientId = dtoIn.clientId;
            entity.gatewayId = dtoIn.gatewayId;
            entity.name = dtoIn.name;
            entity.slug = dtoIn.slug;
            entity.provider = dtoIn.provider;
            entity.providerType = dtoIn.providerType;
            entity.environment = dtoIn.environment;
            entity.token = dtoIn.token;
            entity.origin = dtoIn.origin;
            entity.config = dtoIn.config;
            entity.expiresAt = dtoIn.expiresAt;
            entity.status = dtoIn.status;
            await entity.create();
            return create_api_credential_dto_out_1.CreateApiCredentialDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create api credential';
            throw new Error(message);
        }
    }
};
exports.CreateApiCredentialService = CreateApiCredentialService;
exports.CreateApiCredentialService = CreateApiCredentialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(api_credentials_tokens_1.API_CREDENTIALS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateApiCredentialService);
//# sourceMappingURL=create-api-credential.service.js.map