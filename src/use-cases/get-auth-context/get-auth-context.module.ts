import { Module } from '@nestjs/common';
import { UserCustomersModule } from '../../modules/user-customers/user-customers.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { GetAuthContextController } from './get-auth-context.controller';
import { GetAuthContextUseCase } from './get-auth-context.use-case';

@Module({ imports: [UserCustomersModule, ClientsModule, OfficesModule], controllers: [GetAuthContextController], providers: [GetAuthContextUseCase], exports: [GetAuthContextUseCase] })
export class GetAuthContextModule {}
