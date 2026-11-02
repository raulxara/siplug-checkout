import { Module } from '@nestjs/common';
import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { SyncOwnProfileController } from './sync-own-profile.controller';
import { SyncOwnProfileUseCase } from './sync-own-profile.use-case';
import { OwnProfilesRepository } from './own-profiles.repository';
@Module({
  imports: [GetAuthContextModule],
  controllers: [SyncOwnProfileController],
  providers: [SyncOwnProfileUseCase, OwnProfilesRepository],
})
export class SyncOwnProfileModule {}
