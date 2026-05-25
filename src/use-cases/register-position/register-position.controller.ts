import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { RegisterPositionDtoIn } from './dtos/register-position.dto-in';
import { RegisterPositionRequest } from './http/register-position.request';
import { RegisterPositionUseCase } from './register-position.use-case';

@Controller('positions')
export class RegisterPositionController {
  constructor(
    private readonly registerPositionUseCase: RegisterPositionUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() body: RegisterPositionRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.registerPositionUseCase.exec(
        new RegisterPositionDtoIn({
          token,
          officeId: body.officeId ?? null,
          name: body.name,
          slug: body.slug,
          description: body.description ?? null,
          config: body.config ?? null,
          status: body.status ?? 'active',
        }),
      );

      return {
        status: 'success',
        message: 'position registered successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register position controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}