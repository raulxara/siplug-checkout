import { Module } from '@nestjs/common';
import { LogProviderDispatchModule } from '../log-provider-dispatch/log-provider-dispatch.module';
import { HandleUseCaseExceptionService } from './handle-use-case-exception.service';

@Module({
  imports: [LogProviderDispatchModule],
  providers: [HandleUseCaseExceptionService],
  exports: [HandleUseCaseExceptionService],
})
export class UseCaseSupportModule {}