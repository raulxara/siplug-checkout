import {
  Body,
  Controller,
  Header,
  Headers,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { SyncCompanyProfileRequest } from './sync-company-profile.request';
import { SyncCompanyProfileUseCase } from './sync-company-profile.use-case';
@Controller('auth')
export class SyncCompanyProfileController {
  constructor(private readonly useCase: SyncCompanyProfileUseCase) {}
  @Put('company')
  @Header('Cache-Control', 'no-store')
  async handle(
    @Body() body: SyncCompanyProfileRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const match = /^Bearer ([^\s]+)$/i.exec(authorization ?? '');
    if (!match) throw new UnauthorizedException();
    return { success: true, data: await this.useCase.exec(match[1], body) };
  }
}
