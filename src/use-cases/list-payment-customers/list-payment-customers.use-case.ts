import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import type { PaymentCustomerRow } from '../../modules/payment-customers/entities/payment-customers-repository.interface';
import { GetAllPaymentCustomersByOfficeIdDtoIn } from '../../modules/payment-customers/services/get-all-payment-customers-by-office-id/dtos/get-all-payment-customers-by-office-id.dto-in';
import { GetAllPaymentCustomersByOfficeIdService } from '../../modules/payment-customers/services/get-all-payment-customers-by-office-id/get-all-payment-customers-by-office-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListPaymentCustomersDtoIn } from './dtos/list-payment-customers.dto-in';
import { ListPaymentCustomersDtoOut } from './dtos/list-payment-customers.dto-out';

@Injectable()
export class ListPaymentCustomersUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly getAllPaymentCustomersByOfficeIdService: GetAllPaymentCustomersByOfficeIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListPaymentCustomersDtoIn,
  ): Promise<ListPaymentCustomersDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'listPaymentCustomers',
          requiredEntity: 'payment_customers',
        }),
      );

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const paymentCustomersDtoOut =
        await this.getAllPaymentCustomersByOfficeIdService.exec(
          new GetAllPaymentCustomersByOfficeIdDtoIn(dtoIn.officeId),
        );

      const filteredItems = paymentCustomersDtoOut.items.filter(
        (paymentCustomer) => {
          if (
            dtoIn.status !== null &&
            paymentCustomer.status !== dtoIn.status
          ) {
            return false;
          }

          if (!this.matchesSearch(dtoIn.search, paymentCustomer)) {
            return false;
          }

          return true;
        },
      );

      const total = filteredItems.length;
      const totalPages = Math.ceil(total / dtoIn.perPage);
      const start = (dtoIn.page - 1) * dtoIn.perPage;
      const paginatedItems = filteredItems.slice(
        start,
        start + dtoIn.perPage,
      );

      return new ListPaymentCustomersDtoOut(
        dtoIn.officeId,
        paginatedItems,
        total,
        dtoIn.page,
        dtoIn.perPage,
        totalPages,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListPaymentCustomersUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            status: dtoIn.status,
            search: dtoIn.search,
            page: dtoIn.page,
            perPage: dtoIn.perPage,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list payment customers use case';

      throw new Error(message);
    }
  }

  private matchesSearch(
    search: string | null,
    paymentCustomer: PaymentCustomerRow,
  ): boolean {
    if (search === null || search.trim() === '') {
      return true;
    }

    const normalizedSearch = search.toLowerCase().trim();

    const searchable = [
      paymentCustomer.name,
      paymentCustomer.email ?? '',
      paymentCustomer.phone ?? '',
      paymentCustomer.documentType ?? '',
      paymentCustomer.documentValue ?? '',
      paymentCustomer.externalReference ?? '',
      paymentCustomer.status,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedSearch);
  }
}