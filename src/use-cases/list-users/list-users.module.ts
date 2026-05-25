import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { ProfilesModule } from '../../modules/profiles/profiles.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UserCustomersModule } from '../../modules/user-customers/user-customers.module';
import { UserPositionsModule } from '../../modules/user-positions/user-positions.module';
import { ListUsersController } from './list-users.controller';
import { ListUsersUseCase } from './list-users.use-case';

@Module({
  imports: [
    OfficesModule,
    UserCustomersModule,
    ClientsModule,
    ProfilesModule,
    UserPositionsModule,
    PositionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [ListUsersController],
  providers: [ListUsersUseCase],
  exports: [ListUsersUseCase],
})
export class ListUsersModule {}