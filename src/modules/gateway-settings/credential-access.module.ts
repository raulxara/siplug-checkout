import { Module } from '@nestjs/common';
import { GetAuthContextModule } from '../../use-cases/get-auth-context/get-auth-context.module';
import { SecurityModule } from '../security/security.module';
import { CredentialAccessGuard } from './services/credential-access.guard';
@Module({
  imports: [GetAuthContextModule, SecurityModule],
  providers: [CredentialAccessGuard],
  exports: [CredentialAccessGuard, GetAuthContextModule, SecurityModule],
})
export class CredentialAccessModule {}
