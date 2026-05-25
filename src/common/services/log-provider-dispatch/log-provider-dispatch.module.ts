import { Module } from '@nestjs/common';
import { ApiCredentialsModule } from '../../../modules/api-credentials/api-credentials.module';
import { DispatchLogProviderService } from './dispatch-log-provider.service';

@Module({
  imports: [ApiCredentialsModule],
  providers: [DispatchLogProviderService],
  exports: [DispatchLogProviderService],
})
export class LogProviderDispatchModule {}