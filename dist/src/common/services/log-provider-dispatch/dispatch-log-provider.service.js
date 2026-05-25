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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchLogProviderService = void 0;
const common_1 = require("@nestjs/common");
const build_api_credential_connection_data_dto_in_1 = require("../../../modules/api-credentials/services/build-api-credential-connection-data/dtos/build-api-credential-connection-data.dto-in");
const build_api_credential_connection_data_service_1 = require("../../../modules/api-credentials/services/build-api-credential-connection-data/build-api-credential-connection-data.service");
const dispatch_log_provider_dto_out_1 = require("./dtos/dispatch-log-provider.dto-out");
let DispatchLogProviderService = class DispatchLogProviderService {
    buildApiCredentialConnectionDataService;
    constructor(buildApiCredentialConnectionDataService) {
        this.buildApiCredentialConnectionDataService = buildApiCredentialConnectionDataService;
    }
    async exec(dtoIn) {
        try {
            const connectionData = await this.buildApiCredentialConnectionDataService.exec(new build_api_credential_connection_data_dto_in_1.BuildApiCredentialConnectionDataDtoIn('siplug-log-api'));
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            if (connectionData.token.trim() !== '') {
                headers.Authorization = `${connectionData.tokenPrefix} ${connectionData.token}`;
            }
            if (connectionData.origin && connectionData.origin.trim() !== '') {
                headers.Origin = connectionData.origin;
            }
            for (const [headerName, headerValue] of Object.entries(connectionData.headers)) {
                if (headerName.trim() === '') {
                    continue;
                }
                headers[headerName] = String(headerValue);
            }
            const payload = {
                app_name: dtoIn.appName,
                app_env: dtoIn.appEnv,
                app_file: dtoIn.appFile,
                use_case: dtoIn.useCase,
                type: dtoIn.type,
                message: dtoIn.message,
                trace: dtoIn.trace,
                config: dtoIn.config,
            };
            console.info(JSON.stringify({
                service: 'DispatchLogProviderService',
                event: 'request',
                url: connectionData.url,
                useCase: dtoIn.useCase,
                appName: dtoIn.appName,
                appEnv: dtoIn.appEnv,
                hasAuthorization: Boolean(headers.Authorization),
                origin: headers.Origin ?? null,
            }, null, 2));
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), connectionData.timeoutSeconds * 1000);
            const response = await fetch(connectionData.url, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            clearTimeout(timeout);
            const responseText = await response.text();
            const body = this.parseResponseBody(responseText);
            const success = connectionData.expectedStatusCodes.includes(response.status);
            console.info(JSON.stringify({
                service: 'DispatchLogProviderService',
                event: 'response',
                success,
                statusCode: response.status,
                body,
            }, null, 2));
            return new dispatch_log_provider_dto_out_1.DispatchLogProviderDtoOut(success, response.status, body);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on dispatch log provider';
            console.error(JSON.stringify({
                service: 'DispatchLogProviderService',
                event: 'exception',
                message,
            }, null, 2));
            return new dispatch_log_provider_dto_out_1.DispatchLogProviderDtoOut(false, 0, {
                message,
            });
        }
    }
    parseResponseBody(responseText) {
        try {
            const parsed = JSON.parse(responseText);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
            return {
                raw: parsed,
            };
        }
        catch {
            return {
                raw: responseText,
            };
        }
    }
};
exports.DispatchLogProviderService = DispatchLogProviderService;
exports.DispatchLogProviderService = DispatchLogProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [build_api_credential_connection_data_service_1.BuildApiCredentialConnectionDataService])
], DispatchLogProviderService);
//# sourceMappingURL=dispatch-log-provider.service.js.map