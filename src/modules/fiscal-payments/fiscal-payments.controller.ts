import { Body, Controller, Headers, Post } from '@nestjs/common';
import { FiscalPaymentsUseCase } from './fiscal-payments.use-case';
import { FiscalPaymentsDto } from './fiscal-payments.dto';
@Controller('fiscal-payments')
export class FiscalPaymentsController {
  constructor(private readonly useCase: FiscalPaymentsUseCase) {}
  @Post('confirmed') async list(
    @Body() input: FiscalPaymentsDto,
    @Headers('authorization') auth?: string,
  ) {
    return {
      data: await this.useCase.exec(
        auth?.replace(/^Bearer\s+/i, '').trim() ?? '',
        input,
      ),
    };
  }
}
