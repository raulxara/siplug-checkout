import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { ProfilesModule } from '../../modules/profiles/profiles.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UserAccessCodesModule } from '../../modules/user-access-codes/user-access-codes.module';
import { UserCustomersModule } from '../../modules/user-customers/user-customers.module';
import { UserPositionsModule } from '../../modules/user-positions/user-positions.module';
import { GetUserController } from './get-user.controller';
import { GetUserUseCase } from './get-user.use-case';

@Module({
  imports: [
    UserCustomersModule,
    ClientsModule,
    ProfilesModule,
    UserPositionsModule,
    PositionsModule,
    UserAccessCodesModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [GetUserController],
  providers: [GetUserUseCase],
  exports: [GetUserUseCase],
})
export class GetUserModule {}