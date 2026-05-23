import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { UserPositionsRepository } from './repositories/user-positions.repository';
import { CreateUserPositionService } from './services/create-user-position/create-user-position.service';
import { FindUserPositionByUniqueIdService } from './services/find-user-position-by-unique-id/find-user-position-by-unique-id.service';
import { FindUserPositionByUserCustomerAndPositionService } from './services/find-user-position-by-user-customer-and-position/find-user-position-by-user-customer-and-position.service';
import { GetAllUserPositionsByUserCustomerIdService } from './services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';
import { GetAllUserPositionsByUserCustomerIdsService } from './services/get-all-user-positions-by-user-customer-ids/get-all-user-positions-by-user-customer-ids.service';
import { GetAllUserPositionsService } from './services/get-all-user-positions/get-all-user-positions.service';
import { UpdateUserPositionService } from './services/update-user-position/update-user-position.service';
import { USER_POSITIONS_REPOSITORY } from './tokens/user-positions.tokens';

@Module({
  providers: [
    {
      provide: USER_POSITIONS_REPOSITORY,
      useClass: UserPositionsRepository,
    },
    BuildChangesHistoryService,
    CreateUserPositionService,
    UpdateUserPositionService,
    FindUserPositionByUniqueIdService,
    FindUserPositionByUserCustomerAndPositionService,
    GetAllUserPositionsService,
    GetAllUserPositionsByUserCustomerIdService,
    GetAllUserPositionsByUserCustomerIdsService,
  ],
  exports: [
    USER_POSITIONS_REPOSITORY,
    CreateUserPositionService,
    UpdateUserPositionService,
    FindUserPositionByUniqueIdService,
    FindUserPositionByUserCustomerAndPositionService,
    GetAllUserPositionsService,
    GetAllUserPositionsByUserCustomerIdService,
    GetAllUserPositionsByUserCustomerIdsService,
  ],
})
export class UserPositionsModule {}