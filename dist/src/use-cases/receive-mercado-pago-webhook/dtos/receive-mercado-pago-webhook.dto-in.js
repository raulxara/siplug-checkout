"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveMercadoPagoWebhookDtoIn = void 0;
class ReceiveMercadoPagoWebhookDtoIn {
    apiCredentialId;
    payload;
    headers;
    queryParams;
    devSkipSignature;
    xSignature;
    xRequestId;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.payload = this.toObject(params.payload, 'payload');
        this.headers = this.toObject(params.headers, 'headers');
        this.queryParams = this.toObject(params.queryParams, 'queryParams');
        this.devSkipSignature = params.devSkipSignature === true;
        this.xSignature = String(params.xSignature ?? '').trim();
        this.xRequestId = this.resolveXRequestId({
            xRequestId: params.xRequestId,
            devSkipSignature: this.devSkipSignature,
        });
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
        const appEnv = String(process.env.APP_ENV ?? process.env.NODE_ENV ?? '').toLowerCase();
        const isLocalEnvironment = ['local', 'development', 'dev', 'test'].includes(appEnv);
        if (this.xSignature === '' &&
            !(isLocalEnvironment && this.devSkipSignature === true)) {
            throw new Error('x-signature is required');
        }
        if (this.xRequestId === '' &&
            !(isLocalEnvironment && this.devSkipSignature === true)) {
            throw new Error('x-request-id is required');
        }
    }
    resolveXRequestId(params) {
        const xRequestId = String(params.xRequestId ?? '').trim();
        if (xRequestId !== '') {
            return xRequestId;
        }
        if (params.devSkipSignature === true) {
            return `dev-mercado-pago-webhook-${Date.now()}`;
        }
        return '';
    }
    toObject(value, field) {
        if (value === undefined || value === null) {
            return {};
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.ReceiveMercadoPagoWebhookDtoIn = ReceiveMercadoPagoWebhookDtoIn;
//# sourceMappingURL=receive-mercado-pago-webhook.dto-in.js.map