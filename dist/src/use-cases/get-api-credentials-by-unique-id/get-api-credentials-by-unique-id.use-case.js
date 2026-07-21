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
exports.GetApiCredentialsByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const build_decrypted_api_credential_response_service_1 = require("../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const get_api_credentials_by_unique_id_dto_out_1 = require("./dtos/get-api-credentials-by-unique-id.dto-out");
let GetApiCredentialsByUniqueIdUseCase = class GetApiCredentialsByUniqueIdUseCase {
    findApiCredentialByUniqueIdService;
    buildDecryptedApiCredentialResponseService;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, buildDecryptedApiCredentialResponseService, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.buildDecryptedApiCredentialResponseService = buildDecryptedApiCredentialResponseService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const dtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId));
            const apiCredential = this.buildDecryptedApiCredentialResponseService.exec(dtoOut.apiCredential);
            return new get_api_credentials_by_unique_id_dto_out_1.GetApiCredentialsByUniqueIdDtoOut(apiCredential);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetApiCredentialsByUniqueIdUseCase',
                error,
                appFile: __filename,
                context: {
                    apiCredentialId: dtoIn.apiCredentialId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on get api credentials by unique id use case';
            throw new Error(message);
        }
    }
};
exports.GetApiCredentialsByUniqueIdUseCase = GetApiCredentialsByUniqueIdUseCase;
exports.GetApiCredentialsByUniqueIdUseCase = GetApiCredentialsByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        build_decrypted_api_credential_response_service_1.BuildDecryptedApiCredentialResponseService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetApiCredentialsByUniqueIdUseCase);
//# sourceMappingURL=get-api-credentials-by-unique-id.use-case.js.map