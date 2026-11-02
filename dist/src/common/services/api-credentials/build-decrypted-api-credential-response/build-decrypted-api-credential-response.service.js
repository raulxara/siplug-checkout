"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDecryptedApiCredentialResponseService = void 0;
const common_1 = require("@nestjs/common");
let BuildDecryptedApiCredentialResponseService = class BuildDecryptedApiCredentialResponseService {
    exec(row) { return { _id: row._id, officeId: row.officeId, clientId: row.clientId, gatewayId: row.gatewayId, name: row.name, slug: row.slug, provider: row.provider, environment: row.environment, status: row.status, tokenConfigured: !!row.token, createdAt: row.createdAt, updatedAt: row.updatedAt }; }
};
exports.BuildDecryptedApiCredentialResponseService = BuildDecryptedApiCredentialResponseService;
exports.BuildDecryptedApiCredentialResponseService = BuildDecryptedApiCredentialResponseService = __decorate([
    (0, common_1.Injectable)()
], BuildDecryptedApiCredentialResponseService);
//# sourceMappingURL=build-decrypted-api-credential-response.service.js.map