import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PermissionsModule } from '../../modules/permissions/permissions.module';
import { PositionPermissionsModule } from '../../modules/position-permissions/position-permissions.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { SyncPositionPermissionsController } from './sync-position-permissions.controller';
import { SyncPositionPermissionsUseCase } from './sync-position-permissions.use-case';

@Module({
  imports: [
    PositionsModule,
    PermissionsModule,
    PositionPermissionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [SyncPositionPermissionsController],
  providers: [SyncPositionPermissionsUseCase],
  exports: [SyncPositionPermissionsUseCase],
})
export class SyncPositionPermissionsModule {}