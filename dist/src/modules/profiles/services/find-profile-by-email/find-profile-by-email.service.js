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
exports.FindProfileByEmailService = void 0;
const common_1 = require("@nestjs/common");
const profiles_tokens_1 = require("../../tokens/profiles.tokens");
const find_profile_by_email_dto_out_1 = require("./dtos/find-profile-by-email.dto-out");
let FindProfileByEmailService = class FindProfileByEmailService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const profile = await this.repository.findByEmail(dtoIn.email);
            if (!profile) {
                throw new Error('profile not found');
            }
            return new find_profile_by_email_dto_out_1.FindProfileByEmailDtoOut(profile);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on find profile email';
            throw new Error(message);
        }
    }
};
exports.FindProfileByEmailService = FindProfileByEmailService;
exports.FindProfileByEmailService = FindProfileByEmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(profiles_tokens_1.PROFILES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindProfileByEmailService);
//# sourceMappingURL=find-profile-by-email.service.js.map