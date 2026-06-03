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
exports.HandleUseCaseExceptionService = void 0;
const common_1 = require("@nestjs/common");
const dispatch_log_provider_dto_in_1 = require("../log-provider-dispatch/dtos/dispatch-log-provider.dto-in");
const dispatch_log_provider_service_1 = require("../log-provider-dispatch/dispatch-log-provider.service");
let HandleUseCaseExceptionService = class HandleUseCaseExceptionService {
    dispatchLogProviderService;
    constructor(dispatchLogProviderService) {
        this.dispatchLogProviderService = dispatchLogProviderService;
    }
    async exec(dtoIn) {
        const error = dtoIn.error instanceof Error
            ? dtoIn.error
            : new Error('unknown error');
        console.info(JSON.stringify({
            service: 'HandleUseCaseExceptionService',
            event: 'started',
            useCase: dtoIn.useCase,
            message: error.message,
        }, null, 2));
        try {
            const dispatchResult = await this.dispatchLogProviderService.exec(new dispatch_log_provider_dto_in_1.DispatchLogProviderDtoIn({
                appName: process.env.APP_NAME ?? 'siplug-checkout-api',
                appEnv: process.env.APP_ENV ?? 'local',
                appFile: dtoIn.appFile ?? error.stack?.split('\n')[1]?.trim() ?? '',
                useCase: dtoIn.useCase,
                type: 'error',
                message: error.message,
                trace: error.stack ?? null,
                config: {
                    context: this.sanitizeContext(dtoIn.context),
                },
            }));
            console.info(JSON.stringify({
                service: 'HandleUseCaseExceptionService',
                event: 'dispatch_result',
                useCase: dtoIn.useCase,
                success: dispatchResult.success,
                statusCode: dispatchResult.statusCode,
                body: dispatchResult.body,
            }, null, 2));
            if (dispatchResult.success !== true) {
                console.error(JSON.stringify({
                    service: 'HandleUseCaseExceptionService',
                    event: 'failed_to_dispatch_log_provider',
                    useCase: dtoIn.useCase,
                    statusCode: dispatchResult.statusCode,
                    body: dispatchResult.body,
                }, null, 2));
            }
        }
        catch (errorDispatch) {
            const dispatchMessage = errorDispatch instanceof Error
                ? errorDispatch.message
                : 'unexpected error dispatching log provider';
            console.error(JSON.stringify({
                service: 'HandleUseCaseExceptionService',
                event: 'unexpected_error_dispatching_log_provider',
                useCase: dtoIn.useCase,
                message: dispatchMessage,
            }, null, 2));
        }
    }
    sanitizeContext(context) {
        const sanitized = {};
        for (const [key, value] of Object.entries(context)) {
            const keyAsString = key.toLowerCase();
            if (this.isSensitiveKey(keyAsString)) {
                sanitized[key] = '[protected]';
                continue;
            }
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                sanitized[key] = this.sanitizeContext(value);
                continue;
            }
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeString(value);
                continue;
            }
            sanitized[key] = value;
        }
        return sanitized;
    }
    sanitizeString(value) {
        let sanitized = value;
        sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [protected]');
        sanitized = sanitized.replace(/Basic\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Basic [protected]');
        sanitized = sanitized.replace(/sk-[A-Za-z0-9_-]+/gi, '[protected_openai_key]');
        sanitized = sanitized.replace(/enc::[A-Za-z0-9+/=:.{}"_-]+/gi, 'enc::[protected]');
        if (sanitized.length > 3000) {
            return `${sanitized.substring(0, 3000)}...[truncated]`;
        }
        return sanitized;
    }
    isSensitiveKey(key) {
        return [
            'token',
            'authorization',
            'provider_token',
            'providertoken',
            'api_key',
            'apikey',
            'secret',
            'password',
            'client_secret',
            'clientsecret',
            'access_token',
            'accesstoken',
            'refresh_token',
            'refreshtoken',
            'private_key',
            'privatekey',
            'webhook_secret',
            'webhooksecret',
            'headers',
        ].includes(key);
    }
};
exports.HandleUseCaseExceptionService = HandleUseCaseExceptionService;
exports.HandleUseCaseExceptionService = HandleUseCaseExceptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dispatch_log_provider_service_1.DispatchLogProviderService])
], HandleUseCaseExceptionService);
//# sourceMappingURL=handle-use-case-exception.service.js.map