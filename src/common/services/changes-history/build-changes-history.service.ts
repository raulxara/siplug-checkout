import { Injectable } from '@nestjs/common';
import { formatDateTime } from '../../utils/format-date-time.util';
import { BuildChangesHistoryDtoIn } from './dtos/build-changes-history.dto-in';
import { BuildChangesHistoryDtoOut } from './dtos/build-changes-history.dto-out';

@Injectable()
export class BuildChangesHistoryService {
  exec(dtoIn: BuildChangesHistoryDtoIn): BuildChangesHistoryDtoOut {
    const currentChangesHistory = Array.isArray(dtoIn.currentChangesHistory)
      ? dtoIn.currentChangesHistory
      : [];

    const details: Record<string, { old: unknown; new: unknown }> = {};

    for (const [field, newValue] of Object.entries(dtoIn.newData)) {
      const oldValue = dtoIn.oldData[field] ?? null;

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        details[field] = {
          old: oldValue,
          new: newValue,
        };
      }
    }

    if (Object.keys(details).length === 0) {
      return new BuildChangesHistoryDtoOut({
        changesHistory: currentChangesHistory,
        details: {},
        hasChanges: false,
      });
    }

    const nextIndex = currentChangesHistory.length + 1;
    const actionKey = `action${nextIndex}`;

    const newHistoryItem = {
      [actionKey]: 'update',
      source: dtoIn.source,
      details,
      updated_at: formatDateTime(new Date()),
    };

    return new BuildChangesHistoryDtoOut({
      changesHistory: [...currentChangesHistory, newHistoryItem],
      details,
      hasChanges: true,
    });
  }
}