import {
  Body,
  Controller,
  Header,
  Headers,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { SyncTeamRequest } from './sync-team.request';
import { SyncTeamUseCase } from './sync-team.use-case';
@Controller('auth')
export class SyncTeamController {
  constructor(private readonly useCase: SyncTeamUseCase) {}
  @Put('team')
  @Header('Cache-Control', 'no-store')
  async handle(
    @Body() body: SyncTeamRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const match = /^Bearer ([^\s]+)$/i.exec(authorization ?? '');
    if (!match) throw new UnauthorizedException();
    return { success: true, data: await this.useCase.exec(match[1], body) };
  }
}
