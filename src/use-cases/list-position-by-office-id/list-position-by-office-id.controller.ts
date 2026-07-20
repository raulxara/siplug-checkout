import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { ListPositionByOfficeIdDtoIn } from './dtos/list-position-by-office-id.dto-in';
import { ListPositionByOfficeIdUseCase } from './list-position-by-office-id.use-case';

@Controller('positions')
export class ListPositionByOfficeIdController {
  constructor(
    private readonly listPositionByOfficeIdUseCase: ListPositionByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.listPositionByOfficeIdUseCase.exec(
      new ListPositionByOfficeIdDtoIn({
        officeId: body.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'positions listed successfully',
      data: {
        positions: dtoOut.positions,
        total: dtoOut.total,
      },
    };
  }
}
