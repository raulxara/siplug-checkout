import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { UserAccessCodesRepository } from './repositories/user-access-codes.repository';
import { CreateUserAccessCodeService } from './services/create-user-access-code/create-user-access-code.service';
import { FindUserAccessCodeByCodeService } from './services/find-user-access-code-by-code/find-user-access-code-by-code.service';
import { FindUserAccessCodeByUniqueIdService } from './services/find-user-access-code-by-unique-id/find-user-access-code-by-unique-id.service';
import { GenerateUserAccessCodeService } from './services/generate-user-access-code/generate-user-access-code.service';
import { GetAllUserAccessCodesByUserCustomerIdService } from './services/get-all-user-access-codes-by-user-customer-id/get-all-user-access-codes-by-user-customer-id.service';
import { UpdateUserAccessCodeService } from './services/update-user-access-code/update-user-access-code.service';
import { USER_ACCESS_CODES_REPOSITORY } from './tokens/user-access-codes.tokens';

@Module({
  providers: [
    {
      provide: USER_ACCESS_CODES_REPOSITORY,
      useClass: UserAccessCodesRepository,
    },
    BuildChangesHistoryService,
    GenerateUserAccessCodeService,
    CreateUserAccessCodeService,
    UpdateUserAccessCodeService,
    FindUserAccessCodeByUniqueIdService,
    FindUserAccessCodeByCodeService,
    GetAllUserAccessCodesByUserCustomerIdService,
  ],
  exports: [
    USER_ACCESS_CODES_REPOSITORY,
    GenerateUserAccessCodeService,
    CreateUserAccessCodeService,
    UpdateUserAccessCodeService,
    FindUserAccessCodeByUniqueIdService,
    FindUserAccessCodeByCodeService,
    GetAllUserAccessCodesByUserCustomerIdService,
  ],
})
export class UserAccessCodesModule {}