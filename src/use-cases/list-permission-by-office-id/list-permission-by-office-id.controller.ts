import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { ListPermissionByOfficeIdDtoIn } from './dtos/list-permission-by-office-id.dto-in';
import { ListPermissionByOfficeIdUseCase } from './list-permission-by-office-id.use-case';

@Controller('permissions')
export class ListPermissionByOfficeIdController {
  constructor(
    private readonly listPermissionByOfficeIdUseCase: ListPermissionByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.listPermissionByOfficeIdUseCase.exec(
      new ListPermissionByOfficeIdDtoIn({
        officeId: body.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'permissions listed successfully',
      data: {
        permissions: dtoOut.permissions,
        total: dtoOut.total,
      },
    };
  }
}
