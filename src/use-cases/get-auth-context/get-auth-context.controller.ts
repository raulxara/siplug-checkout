import { Controller, Get, Header, Headers, UnauthorizedException } from '@nestjs/common';
import { GetAuthContextUseCase } from './get-auth-context.use-case';

@Controller('security')
export class GetAuthContextController {
  constructor(private readonly useCase: GetAuthContextUseCase) {}
  @Get('context')
  @Header('Cache-Control', 'no-store')
  async handle(@Headers('authorization') authorization?: string) {
    const match = /^Bearer ([^\s]+)$/i.exec(authorization ?? '');
    if (!match) throw new UnauthorizedException();
    return { success: true, data: await this.useCase.exec(match[1]) };
  }
}
