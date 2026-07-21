import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { UpdatePermissionByUniqueIdDtoIn } from './dtos/update-permission-by-unique-id.dto-in';
import { UpdatePermissionByUniqueIdUseCase } from './update-permission-by-unique-id.use-case';

@Controller('permissions')
export class UpdatePermissionByUniqueIdController {
  constructor(
    private readonly updatePermissionByUniqueIdUseCase: UpdatePermissionByUniqueIdUseCase,
  ) {}

  @Post('update-by-unique-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.updatePermissionByUniqueIdUseCase.exec(
      new UpdatePermissionByUniqueIdDtoIn({
        permissionId: body.permissionId,
        _id: body._id,
        officeId: body.officeId,
        name: body.name,
        slug: body.slug,
        description: body.description,
        entity: body.entity,
        action: body.action,
        config: body.config,
        status: body.status,
      }),
    );

    return {
      status: 'success',
      message: 'permission updated successfully',
      data: {
        permission: dtoOut.permission,
      },
    };
  }
}