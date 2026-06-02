import { Inject, Injectable } from '@nestjs/common';
import type {
  ISubscriptionsRepository,
  SubscriptionRow,
} from '../../entities/subscriptions-repository.interface';
import { SUBSCRIPTIONS_REPOSITORY } from '../../tokens/subscriptions.tokens';
import { UpdateSubscriptionDtoIn } from './dtos/update-subscription.dto-in';
import { UpdateSubscriptionDtoOut } from './dtos/update-subscription.dto-out';

@Injectable()
export class UpdateSubscriptionService {
  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly repository: ISubscriptionsRepository,
  ) {}

  async exec(dtoIn: UpdateSubscriptionDtoIn): Promise<UpdateSubscriptionDtoOut> {
    try {
      const current = await this.repository.findByUniqueId(dtoIn._id);

      if (!current) {
        throw new Error('subscription not found');
      }

      const changesHistory = this.buildChangesHistory({
        current,
        dtoIn,
      });

      const updated = await this.repository.updateByUniqueId(dtoIn._id, {
        current_cycle: dtoIn.currentCycle,
        next_billing_at: dtoIn.nextBillingAt,
        started_at: dtoIn.startedAt,
        canceled_at: dtoIn.canceledAt,
        ended_at: dtoIn.endedAt,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
        status: dtoIn.status,
        changes_history: changesHistory,
      });

      return new UpdateSubscriptionDtoOut(updated);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on update subscription';

      throw new Error(message);
    }
  }

  private buildChangesHistory(params: {
    current: SubscriptionRow;
    dtoIn: UpdateSubscriptionDtoIn;
  }): Array<Record<string, unknown>> {
    const previous = params.current.changesHistory ?? [];

    const changes: Record<string, unknown> = {
      source: params.dtoIn.source,
      changedAt: new Date().toISOString(),
      old: {},
      new: {},
    };

    const oldValues = changes.old as Record<string, unknown>;
    const newValues = changes.new as Record<string, unknown>;

    this.appendChange(oldValues, newValues, 'currentCycle', params.current.currentCycle, params.dtoIn.currentCycle);
    this.appendChange(oldValues, newValues, 'nextBillingAt', params.current.nextBillingAt, params.dtoIn.nextBillingAt);
    this.appendChange(oldValues, newValues, 'startedAt', params.current.startedAt, params.dtoIn.startedAt);
    this.appendChange(oldValues, newValues, 'canceledAt', params.current.canceledAt, params.dtoIn.canceledAt);
    this.appendChange(oldValues, newValues, 'endedAt', params.current.endedAt, params.dtoIn.endedAt);
    this.appendChange(oldValues, newValues, 'status', params.current.status, params.dtoIn.status);

    return [...previous, changes];
  }

  private appendChange(
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>,
    field: string,
    oldValue: unknown,
    newValue: unknown,
  ): void {
    if (newValue === null || newValue === undefined) {
      return;
    }

    if (oldValue === newValue) {
      return;
    }

    oldValues[field] = oldValue;
    newValues[field] = newValue;
  }
}