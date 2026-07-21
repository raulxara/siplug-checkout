"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeApiCredentialConfigService = void 0;
const common_1 = require("@nestjs/common");
const normalize_api_credential_config_dto_out_1 = require("./dtos/normalize-api-credential-config.dto-out");
let NormalizeApiCredentialConfigService = class NormalizeApiCredentialConfigService {
    exec(dtoIn) {
        const baseConfig = dtoIn.config ?? {};
        const normalized = {
            ...baseConfig,
        };
        if (dtoIn.slug === 'siplug-log-api') {
            normalized.base_url = String(normalized.base_url ?? 'http://host.docker.internal:8080');
            normalized.log_endpoint = String(normalized.log_endpoint ?? '/api/v1/log/register');
            normalized.token_prefix = String(normalized.token_prefix ?? 'Bearer');
            normalized.timeout_seconds = Number(normalized.timeout_seconds ?? 15);
            normalized.expected_status_codes = Array.isArray(normalized.expected_status_codes)
                ? normalized.expected_status_codes
                : [200, 201];
            normalized.headers =
                normalized.headers &&
                    typeof normalized.headers === 'object' &&
                    !Array.isArray(normalized.headers)
                    ? normalized.headers
                    : {};
        }
        return new normalize_api_credential_config_dto_out_1.NormalizeApiCredentialConfigDtoOut(normalized);
    }
};
exports.NormalizeApiCredentialConfigService = NormalizeApiCredentialConfigService;
exports.NormalizeApiCredentialConfigService = NormalizeApiCredentialConfigService = __decorate([
    (0, common_1.Injectable)()
], NormalizeApiCredentialConfigService);
//# sourceMappingURL=normalize-api-credential-config.service.js.map