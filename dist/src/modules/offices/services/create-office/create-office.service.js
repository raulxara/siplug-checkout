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
exports.CreateOfficeService = void 0;
const common_1 = require("@nestjs/common");
const office_entity_1 = require("../../entities/office.entity");
const offices_tokens_1 = require("../../tokens/offices.tokens");
const create_office_dto_out_1 = require("./dtos/create-office.dto-out");
let CreateOfficeService = class CreateOfficeService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new office_entity_1.OfficeEntity(this.repository);
            entity.name = dtoIn.name;
            entity.slug = dtoIn.slug;
            entity.language = dtoIn.language;
            entity.currency = dtoIn.currency;
            entity.addressStreet = dtoIn.addressStreet;
            entity.addressNumber = dtoIn.addressNumber;
            entity.addressComplement = dtoIn.addressComplement;
            entity.addressNeighborhood = dtoIn.addressNeighborhood;
            entity.addressCity = dtoIn.addressCity;
            entity.addressState = dtoIn.addressState;
            entity.addressCountry = dtoIn.addressCountry;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            await entity.create();
            return create_office_dto_out_1.CreateOfficeDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on create office';
            throw new Error(message);
        }
    }
};
exports.CreateOfficeService = CreateOfficeService;
exports.CreateOfficeService = CreateOfficeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(offices_tokens_1.OFFICES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateOfficeService);
//# sourceMappingURL=create-office.service.js.map