import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { UpdatePositionByUniqueIdDtoIn } from './dtos/update-position-by-unique-id.dto-in';
import { UpdatePositionByUniqueIdUseCase } from './update-position-by-unique-id.use-case';

@Controller('positions')
export class UpdatePositionByUniqueIdController {
  constructor(
    private readonly updatePositionByUniqueIdUseCase: UpdatePositionByUniqueIdUseCase,
  ) {}

  @Post('update-by-unique-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.updatePositionByUniqueIdUseCase.exec(
      new UpdatePositionByUniqueIdDtoIn({
        positionId: body.positionId,
        _id: body._id,
        officeId: body.officeId,
        name: body.name,
        slug: body.slug,
        description: body.description,
        config: body.config,
        status: body.status,
      }),
    );

    return {
      status: 'success',
      message: 'position updated successfully',
      data: {
        position: dtoOut.position,
      },
    };
  }
}
