import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PermissionsModule } from '../../modules/permissions/permissions.module';
import { UpdatePermissionByUniqueIdController } from './update-permission-by-unique-id.controller';
import { UpdatePermissionByUniqueIdUseCase } from './update-permission-by-unique-id.use-case';

@Module({
  imports: [PermissionsModule, UseCaseSupportModule],
  controllers: [UpdatePermissionByUniqueIdController],
  providers: [UpdatePermissionByUniqueIdUseCase],
  exports: [UpdatePermissionByUniqueIdUseCase],
})
export class UpdatePermissionByUniqueIdModule {}
