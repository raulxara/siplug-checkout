"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleUseCaseExceptionService = void 0;
const common_1 = require("@nestjs/common");
let HandleUseCaseExceptionService = class HandleUseCaseExceptionService {
    async exec(dtoIn) {
        const message = dtoIn.error instanceof Error ? dtoIn.error.message : 'unknown error';
        const stack = dtoIn.error instanceof Error ? dtoIn.error.stack : null;
        const payload = {
            type: 'error',
            useCase: dtoIn.useCase,
            message,
            stack,
            context: this.sanitizeContext(dtoIn.context),
            createdAt: new Date().toISOString(),
        };
        console.error(JSON.stringify(payload, null, 2));
    }
    sanitizeContext(context) {
        const sensitiveKeys = [
            'password',
            'token',
            'providerToken',
            'secret',
            'clientSecret',
            'accessToken',
            'privateKey',
            'webhookSecret',
        ];
        const sanitized = {};
        for (const [key, value] of Object.entries(context)) {
            if (sensitiveKeys.includes(key)) {
                sanitized[key] = '[hidden]';
                continue;
            }
            sanitized[key] = value;
        }
        return sanitized;
    }
};
exports.HandleUseCaseExceptionService = HandleUseCaseExceptionService;
exports.HandleUseCaseExceptionService = HandleUseCaseExceptionService = __decorate([
    (0, common_1.Injectable)()
], HandleUseCaseExceptionService);
//# sourceMappingURL=handle-use-case-exception.service.js.map