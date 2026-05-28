"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveGatewayWebhookDtoIn = void 0;
class ReceiveGatewayWebhookDtoIn {
    provider;
    body;
    query;
    headers;
    constructor(params) {
        this.provider = params.provider ?? '';
        this.body = params.body ?? {};
        this.query = params.query ?? {};
        this.headers = params.headers ?? {};
        if (this.provider.trim() === '') {
            throw new Error('provider is required');
        }
    }
}
exports.ReceiveGatewayWebhookDtoIn = ReceiveGatewayWebhookDtoIn;
//# sourceMappingURL=receive-gateway-webhook.dto-in.js.map