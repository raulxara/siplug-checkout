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
exports.CreateClientService = void 0;
const common_1 = require("@nestjs/common");
const hash_password_service_1 = require("../../../../common/services/security/hash-password.service");
const client_entity_1 = require("../../entities/client.entity");
const clients_tokens_1 = require("../../tokens/clients.tokens");
const create_client_dto_out_1 = require("./dtos/create-client.dto-out");
let CreateClientService = class CreateClientService {
    repository;
    hashPasswordService;
    constructor(repository, hashPasswordService) {
        this.repository = repository;
        this.hashPasswordService = hashPasswordService;
    }
    async exec(dtoIn) {
        try {
            const hashedPassword = await this.hashPasswordService.exec(dtoIn.password);
            const entity = new client_entity_1.ClientEntity(this.repository);
            entity.officeId = dtoIn.officeId;
            entity.customerId = dtoIn.customerId;
            entity.userType = dtoIn.userType;
            entity.username = dtoIn.username;
            entity.password = hashedPassword;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            await entity.create();
            return create_client_dto_out_1.CreateClientDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on create client';
            throw new Error(message);
        }
    }
};
exports.CreateClientService = CreateClientService;
exports.CreateClientService = CreateClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(clients_tokens_1.CLIENTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, hash_password_service_1.HashPasswordService])
], CreateClientService);
//# sourceMappingURL=create-client.service.js.map