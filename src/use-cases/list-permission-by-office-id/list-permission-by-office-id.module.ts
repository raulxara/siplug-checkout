import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PermissionsModule } from '../../modules/permissions/permissions.module';
import { ListPermissionByOfficeIdController } from './list-permission-by-office-id.controller';
import { ListPermissionByOfficeIdUseCase } from './list-permission-by-office-id.use-case';

@Module({
  imports: [PermissionsModule, UseCaseSupportModule],
  controllers: [ListPermissionByOfficeIdController],
  providers: [ListPermissionByOfficeIdUseCase],
  exports: [ListPermissionByOfficeIdUseCase],
})
export class ListPermissionByOfficeIdModule {}
