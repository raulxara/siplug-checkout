import { Body, Controller, Headers, Post } from '@nestjs/common';
import { BillingUseCase } from './billing.use-case';
import {
  BillingListDto,
  BillingIdentityDto,
  BillingActionDto,
  BillingCreateDto,
} from './billing.dto';
@Controller('billing')
export class BillingController {
  constructor(private uc: BillingUseCase) {}
  private token(a: string) {
    return (a || '').replace(/^Bearer\s+/i, '');
  }
  @Post('list') async list(
    @Headers('authorization') a: string,
    @Body() d: BillingListDto,
  ) {
    return { data: await this.uc.list(this.token(a), d) };
  }
  @Post('detail') async detail(
    @Headers('authorization') a: string,
    @Body() d: BillingIdentityDto,
  ) {
    return { data: await this.uc.detail(this.token(a), d) };
  }
  @Post('customers') async customers(
    @Headers('authorization') a: string,
    @Body() d: BillingListDto,
  ) {
    return { data: await this.uc.customers(this.token(a), d.q) };
  }
  @Post('customer') async customer(
    @Headers('authorization') a: string,
    @Body() d: BillingIdentityDto,
  ) {
    return { data: await this.uc.customer(this.token(a), d.id) };
  }
  @Post('create') async create(
    @Headers('authorization') a: string,
    @Body() d: BillingCreateDto,
  ) {
    return { data: await this.uc.create(this.token(a), d) };
  }
  @Post('action') async act(
    @Headers('authorization') a: string,
    @Body() d: BillingActionDto,
  ) {
    return { data: await this.uc.act(this.token(a), d) };
  }
}
