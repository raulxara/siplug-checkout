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
exports.FindOfficeBySlugService = void 0;
const common_1 = require("@nestjs/common");
const offices_tokens_1 = require("../../tokens/offices.tokens");
const find_office_by_slug_dto_out_1 = require("./dtos/find-office-by-slug.dto-out");
let FindOfficeBySlugService = class FindOfficeBySlugService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const office = await this.repository.findBySlug(dtoIn.slug);
            if (!office) {
                throw new Error('office not found');
            }
            return new find_office_by_slug_dto_out_1.FindOfficeBySlugDtoOut(office);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on find office by slug';
            throw new Error(message);
        }
    }
};
exports.FindOfficeBySlugService = FindOfficeBySlugService;
exports.FindOfficeBySlugService = FindOfficeBySlugService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(offices_tokens_1.OFFICES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindOfficeBySlugService);
//# sourceMappingURL=find-office-by-slug.service.js.map