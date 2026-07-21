import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { ListPermissionPositionByPositionIdDtoIn } from './dtos/list-permission-position-by-position-id.dto-in';
import { ListPermissionPositionByPositionIdUseCase } from './list-permission-position-by-position-id.use-case';

@Controller('position-permissions')
export class ListPermissionPositionByPositionIdController {
  constructor(
    private readonly listPermissionPositionByPositionIdUseCase: ListPermissionPositionByPositionIdUseCase,
  ) {}

  @Post('list-by-position-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.listPermissionPositionByPositionIdUseCase.exec(
      new ListPermissionPositionByPositionIdDtoIn({
        positionId: body.positionId,
        officeId: body.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'position permissions listed successfully',
      data: {
        positionPermissions: dtoOut.positionPermissions,
        total: dtoOut.total,
      },
    };
  }
}
