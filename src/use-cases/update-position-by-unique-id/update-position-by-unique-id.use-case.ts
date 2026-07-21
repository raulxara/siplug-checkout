import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import type { PositionRow } from '../../modules/positions/entities/positions-repository.interface';
import { FindPositionByUniqueIdDtoIn } from '../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { UpdatePositionByUniqueIdDtoIn as UpdatePositionByUniqueIdServiceDtoIn } from '../../modules/positions/services/update-position-by-unique-id/dtos/update-position-by-unique-id.dto-in';
import { UpdatePositionByUniqueIdService } from '../../modules/positions/services/update-position-by-unique-id/update-position-by-unique-id.service';
import { UpdatePositionByUniqueIdDtoIn } from './dtos/update-position-by-unique-id.dto-in';
import { UpdatePositionByUniqueIdDtoOut } from './dtos/update-position-by-unique-id.dto-out';

@Injectable()
export class UpdatePositionByUniqueIdUseCase {
  constructor(
    private readonly findPositionByUniqueIdService: FindPositionByUniqueIdService,
    private readonly updatePositionByUniqueIdService: UpdatePositionByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: UpdatePositionByUniqueIdDtoIn,
  ): Promise<UpdatePositionByUniqueIdDtoOut> {
    try {
      const currentPositionDtoOut =
        await this.findPositionByUniqueIdService.exec(
          new FindPositionByUniqueIdDtoIn(dtoIn.positionId),
        );

      const currentPosition = currentPositionDtoOut.position;

      if (
        dtoIn.officeId !== undefined &&
        currentPosition.officeId !== null &&
        currentPosition.officeId !== dtoIn.officeId
      ) {
        throw new Error('position does not belong to informed officeId');
      }

      const updateData = this.buildUpdateData(dtoIn, currentPosition);

      const updatedPositionDtoOut =
        await this.updatePositionByUniqueIdService.exec(
          new UpdatePositionByUniqueIdServiceDtoIn({
            positionId: dtoIn.positionId,
            data: updateData,
          }),
        );

      return new UpdatePositionByUniqueIdDtoOut({
        ...updatedPositionDtoOut.position,
      });
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdatePositionByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            positionId: dtoIn.positionId,
            officeId: dtoIn.officeId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update position by unique id use case';

      throw new Error(message);
    }
  }

  private buildUpdateData(
    dtoIn: UpdatePositionByUniqueIdDtoIn,
    currentPosition: PositionRow,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    const details: Record<string, { old: unknown; new: unknown }> = {};

    if (dtoIn.name !== undefined) {
      data.name = dtoIn.name;

      if (currentPosition.name !== dtoIn.name) {
        details.name = {
          old: currentPosition.name,
          new: dtoIn.name,
        };
      }
    }

    if (dtoIn.slug !== undefined) {
      data.slug = dtoIn.slug;

      if (currentPosition.slug !== dtoIn.slug) {
        details.slug = {
          old: currentPosition.slug,
          new: dtoIn.slug,
        };
      }
    }

    if (dtoIn.description !== undefined) {
      data.description = dtoIn.description;

      if (currentPosition.description !== dtoIn.description) {
        details.description = {
          old: currentPosition.description,
          new: dtoIn.description,
        };
      }
    }

    if (dtoIn.config !== undefined) {
      data.config = dtoIn.config;

      if (
        JSON.stringify(currentPosition.config ?? {}) !==
        JSON.stringify(dtoIn.config)
      ) {
        details.config = {
          old: currentPosition.config,
          new: dtoIn.config,
        };
      }
    }

    if (dtoIn.status !== undefined) {
      data.status = dtoIn.status;

      if (currentPosition.status !== dtoIn.status) {
        details.status = {
          old: currentPosition.status,
          new: dtoIn.status,
        };
      }
    }

    data.changes_history = this.buildChangesHistory(
      currentPosition.changesHistory,
      details,
    );

    return data;
  }

  private buildChangesHistory(
    currentChangesHistory: unknown,
    details: Record<string, { old: unknown; new: unknown }>,
  ): unknown[] {
    const history = this.normalizeChangesHistory(currentChangesHistory);

    return [
      ...history,
      {
        source: 'UpdatePositionByUniqueIdController',
        action: 'update',
        details,
        updated_at: this.nowAsSqlDateTime(),
      },
    ];
  }

  private normalizeChangesHistory(currentChangesHistory: unknown): unknown[] {
    if (Array.isArray(currentChangesHistory)) {
      return currentChangesHistory;
    }

    if (typeof currentChangesHistory === 'string') {
      try {
        const parsed = JSON.parse(currentChangesHistory);

        if (Array.isArray(parsed)) {
          return parsed;
        }

        return [];
      } catch {
        return [];
      }
    }

    return [];
  }

  private nowAsSqlDateTime(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());
    const seconds = this.pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
