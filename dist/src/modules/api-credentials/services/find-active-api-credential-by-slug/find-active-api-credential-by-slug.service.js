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
exports.FindActiveApiCredentialBySlugService = void 0;
const common_1 = require("@nestjs/common");
const api_credentials_tokens_1 = require("../../tokens/api-credentials.tokens");
const find_active_api_credential_by_slug_dto_out_1 = require("./dtos/find-active-api-credential-by-slug.dto-out");
let FindActiveApiCredentialBySlugService = class FindActiveApiCredentialBySlugService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const rows = await this.repository.getAll();
            const row = rows.find((item) => item.slug === dtoIn.slug && item.status === 'active');
            if (!row) {
                throw new Error(`active api credential not found for slug ${dtoIn.slug}`);
            }
            return new find_active_api_credential_by_slug_dto_out_1.FindActiveApiCredentialBySlugDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on find active api credential by slug';
            throw new Error(message);
        }
    }
};
exports.FindActiveApiCredentialBySlugService = FindActiveApiCredentialBySlugService;
exports.FindActiveApiCredentialBySlugService = FindActiveApiCredentialBySlugService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(api_credentials_tokens_1.API_CREDENTIALS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindActiveApiCredentialBySlugService);
//# sourceMappingURL=find-active-api-credential-by-slug.service.js.map