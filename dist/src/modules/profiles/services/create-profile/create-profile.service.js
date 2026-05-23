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
exports.CreateProfileService = void 0;
const common_1 = require("@nestjs/common");
const profile_entity_1 = require("../../entities/profile.entity");
const profiles_tokens_1 = require("../../tokens/profiles.tokens");
const create_profile_dto_out_1 = require("./dtos/create-profile.dto-out");
let CreateProfileService = class CreateProfileService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new profile_entity_1.ProfileEntity(this.repository);
            entity.firstName = dtoIn.firstName;
            entity.lastName = dtoIn.lastName;
            entity.email = dtoIn.email;
            entity.phone = dtoIn.phone;
            entity.documentType = dtoIn.documentType;
            entity.documentValue = dtoIn.documentValue;
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
            return create_profile_dto_out_1.CreateProfileDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on create profile';
            throw new Error(message);
        }
    }
};
exports.CreateProfileService = CreateProfileService;
exports.CreateProfileService = CreateProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(profiles_tokens_1.PROFILES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateProfileService);
//# sourceMappingURL=create-profile.service.js.map