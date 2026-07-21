"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveInfinitePayWebhookDtoIn = void 0;
class ReceiveInfinitePayWebhookDtoIn {
    apiCredentialId;
    payload;
    headers;
    constructor(params) {
        const apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.apiCredentialId = apiCredentialId === '' ? null : apiCredentialId;
        if (!params.payload ||
            typeof params.payload !== 'object' ||
            Array.isArray(params.payload)) {
            throw new Error('payload is required');
        }
        this.payload = params.payload;
        this.headers = params.headers ?? {};
    }
}
exports.ReceiveInfinitePayWebhookDtoIn = ReceiveInfinitePayWebhookDtoIn;
//# sourceMappingURL=receive-infinitepay-webhook.dto-in.js.map