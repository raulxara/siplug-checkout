import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPositionByUniqueIdDtoIn } from '../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { GetPositionByUniqueIdDtoIn } from './dtos/get-position-by-unique-id.dto-in';
import { GetPositionByUniqueIdDtoOut } from './dtos/get-position-by-unique-id.dto-out';

@Injectable()
export class GetPositionByUniqueIdUseCase {
  constructor(
    private readonly findPositionByUniqueIdService: FindPositionByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetPositionByUniqueIdDtoIn,
  ): Promise<GetPositionByUniqueIdDtoOut> {
    try {
      const dtoOut = await this.findPositionByUniqueIdService.exec(
        new FindPositionByUniqueIdDtoIn(dtoIn.positionId),
      );

      return new GetPositionByUniqueIdDtoOut({
        ...dtoOut.position,
      });
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetPositionByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            positionId: dtoIn.positionId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on get position by unique id use case';

      throw new Error(message);
    }
  }
}
