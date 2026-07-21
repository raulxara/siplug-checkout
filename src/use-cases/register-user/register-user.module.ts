import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { ProfilesModule } from '../../modules/profiles/profiles.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UserAccessCodesModule } from '../../modules/user-access-codes/user-access-codes.module';
import { UserCustomersModule } from '../../modules/user-customers/user-customers.module';
import { UserPositionsModule } from '../../modules/user-positions/user-positions.module';
import { RegisterUserController } from './register-user.controller';
import { RegisterUserUseCase } from './register-user.use-case';

@Module({
  imports: [
    OfficesModule,
    ProfilesModule,
    ClientsModule,
    UserCustomersModule,
    UserPositionsModule,
    UserAccessCodesModule,
    PositionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [RegisterUserController],
  providers: [RegisterUserUseCase],
  exports: [RegisterUserUseCase],
})
export class RegisterUserModule {}