import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common';
import { RegisterPermissionDtoIn } from './dtos/register-permission.dto-in';
import { RegisterPermissionRequest } from './http/register-permission.request';
import { RegisterPermissionUseCase } from './register-permission.use-case';

@Controller('permissions')
export class RegisterPermissionController {
  constructor(
    private readonly registerPermissionUseCase: RegisterPermissionUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() body: RegisterPermissionRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.registerPermissionUseCase.exec(
        new RegisterPermissionDtoIn({
          token,
          officeId: body.officeId ?? null,
          name: body.name,
          slug: body.slug,
          description: body.description ?? null,
          entity: body.entity,
          action: body.action,
          config: body.config ?? null,
          status: body.status ?? 'active',
        }),
      );

      return {
        status: 'success',
        message: 'permission registered successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register permission controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}