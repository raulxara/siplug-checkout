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
exports.UpdateApiCredentialService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const build_changes_history_dto_in_1 = require("../../../../common/services/changes-history/dtos/build-changes-history.dto-in");
const api_credentials_tokens_1 = require("../../tokens/api-credentials.tokens");
const update_api_credential_dto_out_1 = require("./dtos/update-api-credential.dto-out");
let UpdateApiCredentialService = class UpdateApiCredentialService {
    repository;
    buildChangesHistoryService;
    constructor(repository, buildChangesHistoryService) {
        this.repository = repository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        try {
            const currentRow = await this.repository.findByUniqueId(dtoIn._id);
            if (!currentRow) {
                throw new Error('api credential not found');
            }
            const newDataForHistory = this.removeNullValues({
                officeId: dtoIn.officeId,
                clientId: dtoIn.clientId,
                gatewayId: dtoIn.gatewayId,
                name: dtoIn.name,
                slug: dtoIn.slug,
                provider: dtoIn.provider,
                providerType: dtoIn.providerType,
                environment: dtoIn.environment,
                token: dtoIn.token !== null ? '[protected_updated]' : null,
                origin: dtoIn.origin,
                config: dtoIn.config !== null ? this.sanitizeConfig(dtoIn.config) : null,
                expiresAt: dtoIn.expiresAt,
                status: dtoIn.status,
            });
            const historyDtoOut = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
                currentChangesHistory: currentRow.changesHistory,
                oldData: this.buildOldData(currentRow),
                newData: newDataForHistory,
                source: dtoIn.source,
            }));
            const row = await this.repository.updateByUniqueId(dtoIn._id, {
                office_id: dtoIn.officeId,
                client_id: dtoIn.clientId,
                gateway_id: dtoIn.gatewayId,
                name: dtoIn.name,
                slug: dtoIn.slug,
                provider: dtoIn.provider,
                provider_type: dtoIn.providerType,
                environment: dtoIn.environment,
                token: dtoIn.token,
                origin: dtoIn.origin,
                config: dtoIn.config,
                expires_at: dtoIn.expiresAt,
                changes_history: historyDtoOut.hasChanges
                    ? historyDtoOut.changesHistory
                    : currentRow.changesHistory,
                status: dtoIn.status,
            });
            return new update_api_credential_dto_out_1.UpdateApiCredentialDtoOut(row);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update api credential';
            throw new Error(message);
        }
    }
    removeNullValues(data) {
        return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
    }
    buildOldData(row) {
        return {
            officeId: row.officeId,
            clientId: row.clientId,
            gatewayId: row.gatewayId,
            name: row.name,
            slug: row.slug,
            provider: row.provider,
            providerType: row.providerType,
            environment: row.environment,
            token: row.token ? '[protected_current]' : null,
            origin: row.origin,
            config: row.config ? this.sanitizeConfig(row.config) : null,
            expiresAt: row.expiresAt,
            status: row.status,
        };
    }
    sanitizeConfig(config) {
        const sanitized = {};
        for (const [key, value] of Object.entries(config)) {
            const normalizedKey = key.toLowerCase();
            if (this.isSensitiveKey(normalizedKey)) {
                sanitized[key] = '[protected]';
                continue;
            }
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                sanitized[key] = this.sanitizeConfig(value);
                continue;
            }
            sanitized[key] = value;
        }
        return sanitized;
    }
    isSensitiveKey(key) {
        return [
            'token',
            'client_token',
            'secret',
            'password',
            'apikey',
            'api_key',
            'clientsecret',
            'client_secret',
            'accesstoken',
            'access_token',
            'privatekey',
            'private_key',
            'webhooksecret',
            'webhook_secret',
        ].includes(key);
    }
};
exports.UpdateApiCredentialService = UpdateApiCredentialService;
exports.UpdateApiCredentialService = UpdateApiCredentialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(api_credentials_tokens_1.API_CREDENTIALS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateApiCredentialService);
//# sourceMappingURL=update-api-credential.service.js.map