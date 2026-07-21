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
exports.ListApiCredentialByOfficeIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const build_decrypted_api_credential_response_service_1 = require("../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const list_api_credentials_by_office_id_dto_in_1 = require("../../modules/api-credentials/services/list-api-credentials-by-office-id/dtos/list-api-credentials-by-office-id.dto-in");
const list_api_credentials_by_office_id_service_1 = require("../../modules/api-credentials/services/list-api-credentials-by-office-id/list-api-credentials-by-office-id.service");
const list_api_credential_by_office_id_dto_out_1 = require("./dtos/list-api-credential-by-office-id.dto-out");
let ListApiCredentialByOfficeIdUseCase = class ListApiCredentialByOfficeIdUseCase {
    listApiCredentialsByOfficeIdService;
    buildDecryptedApiCredentialResponseService;
    handleUseCaseExceptionService;
    constructor(listApiCredentialsByOfficeIdService, buildDecryptedApiCredentialResponseService, handleUseCaseExceptionService) {
        this.listApiCredentialsByOfficeIdService = listApiCredentialsByOfficeIdService;
        this.buildDecryptedApiCredentialResponseService = buildDecryptedApiCredentialResponseService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const dtoOut = await this.listApiCredentialsByOfficeIdService.exec(new list_api_credentials_by_office_id_dto_in_1.ListApiCredentialsByOfficeIdDtoIn({
                officeId: dtoIn.officeId,
            }));
            const apiCredentials = dtoOut.apiCredentials.map((apiCredential) => this.buildDecryptedApiCredentialResponseService.exec(apiCredential));
            return new list_api_credential_by_office_id_dto_out_1.ListApiCredentialByOfficeIdDtoOut(apiCredentials, apiCredentials.length);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ListApiCredentialByOfficeIdUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on list api credential by office id use case';
            throw new Error(message);
        }
    }
};
exports.ListApiCredentialByOfficeIdUseCase = ListApiCredentialByOfficeIdUseCase;
exports.ListApiCredentialByOfficeIdUseCase = ListApiCredentialByOfficeIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [list_api_credentials_by_office_id_service_1.ListApiCredentialsByOfficeIdService,
        build_decrypted_api_credential_response_service_1.BuildDecryptedApiCredentialResponseService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ListApiCredentialByOfficeIdUseCase);
//# sourceMappingURL=list-api-credential-by-office-id.use-case.js.map