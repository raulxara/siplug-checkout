import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ListPositionsByOfficeIdDtoIn } from '../../modules/positions/services/list-positions-by-office-id/dtos/list-positions-by-office-id.dto-in';
import { ListPositionsByOfficeIdService } from '../../modules/positions/services/list-positions-by-office-id/list-positions-by-office-id.service';
import { ListPositionByOfficeIdDtoIn } from './dtos/list-position-by-office-id.dto-in';
import { ListPositionByOfficeIdDtoOut } from './dtos/list-position-by-office-id.dto-out';

@Injectable()
export class ListPositionByOfficeIdUseCase {
  constructor(
    private readonly listPositionsByOfficeIdService: ListPositionsByOfficeIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListPositionByOfficeIdDtoIn,
  ): Promise<ListPositionByOfficeIdDtoOut> {
    try {
      const dtoOut = await this.listPositionsByOfficeIdService.exec(
        new ListPositionsByOfficeIdDtoIn({
          officeId: dtoIn.officeId,
        }),
      );

      return new ListPositionByOfficeIdDtoOut(
        dtoOut.positions.map((position) => ({
          ...position,
        })),
        dtoOut.positions.length,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListPositionByOfficeIdUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list position by office id use case';

      throw new Error(message);
    }
  }
}
