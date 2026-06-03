"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchLogProviderDtoIn = void 0;
class DispatchLogProviderDtoIn {
    appName;
    appEnv;
    appFile;
    useCase;
    type;
    message;
    trace;
    config;
    constructor(params) {
        this.appName = params.appName;
        this.appEnv = params.appEnv;
        this.appFile = params.appFile;
        this.useCase = params.useCase;
        this.type = params.type;
        this.message = params.message;
        this.trace = params.trace ?? null;
        this.config = params.config ?? null;
        if (this.appName.trim() === '') {
            throw new Error('appName is required');
        }
        if (this.appEnv.trim() === '') {
            throw new Error('appEnv is required');
        }
        if (this.appFile.trim() === '') {
            throw new Error('appFile is required');
        }
        if (this.useCase.trim() === '') {
            throw new Error('useCase is required');
        }
        if (this.type.trim() === '') {
            throw new Error('type is required');
        }
        if (this.message.trim() === '') {
            throw new Error('message is required');
        }
    }
}
exports.DispatchLogProviderDtoIn = DispatchLogProviderDtoIn;
//# sourceMappingURL=dispatch-log-provider.dto-in.js.map