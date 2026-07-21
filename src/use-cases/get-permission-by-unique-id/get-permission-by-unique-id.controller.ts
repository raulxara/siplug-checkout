import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { GetPermissionByUniqueIdDtoIn } from './dtos/get-permission-by-unique-id.dto-in';
import { GetPermissionByUniqueIdUseCase } from './get-permission-by-unique-id.use-case';

@Controller('permissions')
export class GetPermissionByUniqueIdController {
  constructor(
    private readonly getPermissionByUniqueIdUseCase: GetPermissionByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.getPermissionByUniqueIdUseCase.exec(
      new GetPermissionByUniqueIdDtoIn({
        permissionId: body.permissionId,
        _id: body._id,
      }),
    );

    return {
      status: 'success',
      message: 'permission found successfully',
      data: {
        permission: dtoOut.permission,
      },
    };
  }
}
