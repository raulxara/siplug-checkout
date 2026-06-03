"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildApiCredentialConnectionDataDtoOut = void 0;
class BuildApiCredentialConnectionDataDtoOut {
    url;
    token;
    tokenPrefix;
    origin;
    timeoutSeconds;
    headers;
    expectedStatusCodes;
    credential;
    constructor(url, token, tokenPrefix, origin, timeoutSeconds, headers, expectedStatusCodes, credential) {
        this.url = url;
        this.token = token;
        this.tokenPrefix = tokenPrefix;
        this.origin = origin;
        this.timeoutSeconds = timeoutSeconds;
        this.headers = headers;
        this.expectedStatusCodes = expectedStatusCodes;
        this.credential = credential;
    }
}
exports.BuildApiCredentialConnectionDataDtoOut = BuildApiCredentialConnectionDataDtoOut;
//# sourceMappingURL=build-api-credential-connection-data.dto-out.js.map