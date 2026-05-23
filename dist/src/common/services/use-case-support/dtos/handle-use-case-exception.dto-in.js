"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleUseCaseExceptionDtoIn = void 0;
class HandleUseCaseExceptionDtoIn {
    useCase;
    error;
    context;
    constructor(params) {
        this.useCase = params.useCase;
        this.error = params.error;
        this.context = params.context ?? {};
        if (this.useCase.trim() === '') {
            throw new Error('useCase is required');
        }
    }
}
exports.HandleUseCaseExceptionDtoIn = HandleUseCaseExceptionDtoIn;
//# sourceMappingURL=handle-use-case-exception.dto-in.js.map