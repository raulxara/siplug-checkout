import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { GetPositionByUniqueIdDtoIn } from './dtos/get-position-by-unique-id.dto-in';
import { GetPositionByUniqueIdUseCase } from './get-position-by-unique-id.use-case';

@Controller('positions')
export class GetPositionByUniqueIdController {
  constructor(
    private readonly getPositionByUniqueIdUseCase: GetPositionByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.getPositionByUniqueIdUseCase.exec(
      new GetPositionByUniqueIdDtoIn({
        positionId: body.positionId,
        _id: body._id,
      }),
    );

    return {
      status: 'success',
      message: 'position found successfully',
      data: {
        position: dtoOut.position,
      },
    };
  }
}
