import {
  Body,
  Controller,
  Header,
  Headers,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { SyncOwnProfileRequest } from './sync-own-profile.request';
import { SyncOwnProfileUseCase } from './sync-own-profile.use-case';
@Controller('auth')
export class SyncOwnProfileController {
  constructor(private readonly useCase: SyncOwnProfileUseCase) {}
  @Put('profile')
  @Header('Cache-Control', 'no-store')
  async handle(
    @Body() body: SyncOwnProfileRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const match = /^Bearer ([^\s]+)$/i.exec(authorization ?? '');
    if (!match) throw new UnauthorizedException();
    return { success: true, data: await this.useCase.exec(match[1], body) };
  }
}
