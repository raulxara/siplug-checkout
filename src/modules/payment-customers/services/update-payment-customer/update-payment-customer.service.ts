import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IPaymentCustomersRepository,
  PaymentCustomerRow,
} from '../../entities/payment-customers-repository.interface';
import { PAYMENT_CUSTOMERS_REPOSITORY } from '../../tokens/payment-customers.tokens';
import { UpdatePaymentCustomerDtoIn } from './dtos/update-payment-customer.dto-in';
import { UpdatePaymentCustomerDtoOut } from './dtos/update-payment-customer.dto-out';

@Injectable()
export class UpdatePaymentCustomerService {
  constructor(
    @Inject(PAYMENT_CUSTOMERS_REPOSITORY)
    private readonly repository: IPaymentCustomersRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentCustomerDtoIn,
  ): Promise<UpdatePaymentCustomerDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('payment customer not found');
      }

      const newDataForHistory = this.removeNullValues({
        officeId: dtoIn.officeId,
        clientId: dtoIn.clientId,
        profileId: dtoIn.profileId,
        externalReference: dtoIn.externalReference,
        name: dtoIn.name,
        email: dtoIn.email,
        documentType: dtoIn.documentType,
        documentValue: dtoIn.documentValue,
        phone: dtoIn.phone,
        billingAddress: dtoIn.billingAddress,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
        status: dtoIn.status,
      });

      const historyDtoOut = this.buildChangesHistoryService.exec(
        new BuildChangesHistoryDtoIn({
          currentChangesHistory: currentRow.changesHistory,
          oldData: this.buildOldData(currentRow),
          newData: newDataForHistory,
          source: dtoIn.source,
        }),
      );

      const row = await this.repository.updateByUniqueId(dtoIn._id, {
        office_id: dtoIn.officeId,
        client_id: dtoIn.clientId,
        profile_id: dtoIn.profileId,
        external_reference: dtoIn.externalReference,
        name: dtoIn.name,
        email: dtoIn.email,
        document_type: dtoIn.documentType,
        document_value: dtoIn.documentValue,
        phone: dtoIn.phone,
        billing_address: dtoIn.billingAddress,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdatePaymentCustomerDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update payment customer';

      throw new Error(message);
    }
  }

  private removeNullValues(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null),
    );
  }

  private buildOldData(row: PaymentCustomerRow): Record<string, unknown> {
    return {
      officeId: row.officeId,
      clientId: row.clientId,
      profileId: row.profileId,
      externalReference: row.externalReference,
      name: row.name,
      email: row.email,
      documentType: row.documentType,
      documentValue: row.documentValue,
      phone: row.phone,
      billingAddress: row.billingAddress,
      metadata: row.metadata,
      config: row.config,
      status: row.status,
    };
  }
}