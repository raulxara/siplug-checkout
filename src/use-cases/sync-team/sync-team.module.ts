import { SecurityModule } from '../../modules/security/security.module';
import { Module } from '@nestjs/common';
import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { SyncTeamController } from './sync-team.controller';
import { SyncTeamUseCase } from './sync-team.use-case';
import { TeamProjectionRepository } from './team-projection.repository';
@Module({
  imports: [GetAuthContextModule, SecurityModule],
  controllers: [SyncTeamController],
  providers: [SyncTeamUseCase, TeamProjectionRepository],
})
export class SyncTeamModule {}
