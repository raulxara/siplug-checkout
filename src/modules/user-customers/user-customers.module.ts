import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { UserCustomersRepository } from './repositories/user-customers.repository';
import { CreateUserCustomerService } from './services/create-user-customer/create-user-customer.service';
import { FindUserCustomerByTokenService } from './services/find-user-customer-by-token/find-user-customer-by-token.service';
import { FindUserCustomerByUniqueIdService } from './services/find-user-customer-by-unique-id/find-user-customer-by-unique-id.service';
import { GenerateUserCustomerTokenService } from './services/generate-user-customer-token/generate-user-customer-token.service';
import { GetAllUserCustomersByClientIdService } from './services/get-all-user-customers-by-client-id/get-all-user-customers-by-client-id.service';
import { GetAllUserCustomersService } from './services/get-all-user-customers/get-all-user-customers.service';
import { UpdateUserCustomerService } from './services/update-user-customer/update-user-customer.service';
import { USER_CUSTOMERS_REPOSITORY } from './tokens/user-customers.tokens';

@Module({
  providers: [
    {
      provide: USER_CUSTOMERS_REPOSITORY,
      useClass: UserCustomersRepository,
    },
    BuildChangesHistoryService,
    GenerateUserCustomerTokenService,
    CreateUserCustomerService,
    UpdateUserCustomerService,
    FindUserCustomerByUniqueIdService,
    FindUserCustomerByTokenService,
    GetAllUserCustomersService,
    GetAllUserCustomersByClientIdService,
  ],
  exports: [
    USER_CUSTOMERS_REPOSITORY,
    GenerateUserCustomerTokenService,
    CreateUserCustomerService,
    UpdateUserCustomerService,
    FindUserCustomerByUniqueIdService,
    FindUserCustomerByTokenService,
    GetAllUserCustomersService,
    GetAllUserCustomersByClientIdService,
  ],
})
export class UserCustomersModule {}