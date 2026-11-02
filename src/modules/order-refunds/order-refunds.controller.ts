import { Body, Controller, Headers, Post } from '@nestjs/common';
import { OrderRefundsUseCase } from './order-refunds.use-case';
import {
  OrderRefundDto,
  OrderRefundListDto,
  CancelOrderSubscriptionDto,
  ReconcileOrderRefundDto,
} from './order-refunds.dto';
@Controller('order-refunds')
export class OrderRefundsController {
  constructor(private readonly uc: OrderRefundsUseCase) {}
  @Post('payments') async list(
    @Headers('authorization') auth: string,
    @Body() d: OrderRefundListDto,
  ) {
    return {
      data: await this.uc.list(
        (auth ?? '').replace(/^Bearer\s+/i, ''),
        d.orderId,
      ),
    };
  }
  @Post('subscriptions') async subscriptions(
    @Headers('authorization') auth: string,
    @Body() d: OrderRefundListDto,
  ) {
    return {
      data: await this.uc.subscriptions(
        (auth ?? '').replace(/^Bearer\s+/i, ''),
        d.orderId,
      ),
    };
  }
  @Post('cancel-subscription') async cancel(
    @Headers('authorization') auth: string,
    @Body() d: CancelOrderSubscriptionDto,
  ) {
    return {
      data: await this.uc.cancelSubscription(
        (auth ?? '').replace(/^Bearer\s+/i, ''),
        d,
      ),
    };
  }
  @Post('reconcile') async reconcile(
    @Headers('authorization') auth: string,
    @Body() d: ReconcileOrderRefundDto,
  ) {
    return {
      data: await this.uc.reconcile((auth ?? '').replace(/^Bearer\s+/i, ''), d),
    };
  }
  @Post('process') async process(
    @Headers('authorization') auth: string,
    @Body() d: OrderRefundDto,
  ) {
    return {
      data: await this.uc.exec((auth ?? '').replace(/^Bearer\s+/i, ''), d),
    };
  }
}
