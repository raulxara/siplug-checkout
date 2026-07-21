import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { SyncPositionPermissionsDtoIn } from './dtos/sync-position-permissions.dto-in';
import { SyncPositionPermissionsRequest } from './http/sync-position-permissions.request';
import { SyncPositionPermissionsUseCase } from './sync-position-permissions.use-case';

@Controller('position-permissions')
export class SyncPositionPermissionsController {
  constructor(
    private readonly syncPositionPermissionsUseCase: SyncPositionPermissionsUseCase,
  ) {}

  @Post('sync')
  async handle(
    @Body() body: SyncPositionPermissionsRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.syncPositionPermissionsUseCase.exec(
        new SyncPositionPermissionsDtoIn({
          token,
          positionId: body.positionId,
          permissionIds: body.permissionIds,
          source: body.source ?? 'SyncPositionPermissionsController',
        }),
      );

      return {
        status: 'success',
        message: 'position permissions synced successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on sync position permissions controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}