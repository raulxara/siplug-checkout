import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PositionPermissionsModule } from '../../modules/position-permissions/position-permissions.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { ListPermissionPositionByPositionIdController } from './list-permission-position-by-position-id.controller';
import { ListPermissionPositionByPositionIdUseCase } from './list-permission-position-by-position-id.use-case';

@Module({
  imports: [PositionsModule, PositionPermissionsModule, UseCaseSupportModule],
  controllers: [ListPermissionPositionByPositionIdController],
  providers: [ListPermissionPositionByPositionIdUseCase],
  exports: [ListPermissionPositionByPositionIdUseCase],
})
export class ListPermissionPositionByPositionIdModule {}
