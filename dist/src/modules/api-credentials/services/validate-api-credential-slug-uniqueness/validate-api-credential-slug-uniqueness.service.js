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
exports.ValidateApiCredentialSlugUniquenessService = void 0;
const common_1 = require("@nestjs/common");
const api_credentials_tokens_1 = require("../../tokens/api-credentials.tokens");
let ValidateApiCredentialSlugUniquenessService = class ValidateApiCredentialSlugUniquenessService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const apiCredential = await this.repository.findByOfficeIdAndSlug(dtoIn.officeId, dtoIn.slug);
            if (apiCredential) {
                throw new Error('api credential slug already exists');
            }
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on validate api credential slug uniqueness';
            throw new Error(message);
        }
    }
};
exports.ValidateApiCredentialSlugUniquenessService = ValidateApiCredentialSlugUniquenessService;
exports.ValidateApiCredentialSlugUniquenessService = ValidateApiCredentialSlugUniquenessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(api_credentials_tokens_1.API_CREDENTIALS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ValidateApiCredentialSlugUniquenessService);
//# sourceMappingURL=validate-api-credential-slug-uniqueness.service.js.map