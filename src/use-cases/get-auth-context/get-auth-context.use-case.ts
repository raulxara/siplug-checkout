import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { FindUserCustomerByTokenService } from '../../modules/user-customers/services/find-user-customer-by-token/find-user-customer-by-token.service';
import { FindUserCustomerByTokenDtoIn } from '../../modules/user-customers/services/find-user-customer-by-token/dtos/find-user-customer-by-token.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';

@Injectable()
export class GetAuthContextUseCase {
  constructor(
    private readonly customers: FindUserCustomerByTokenService,
    private readonly clients: FindClientByUniqueIdService,
    private readonly offices: FindOfficeByUniqueIdService,
  ) {}

  async exec(token: string) {
    if (!token || token.length > 4096 || /[\r\n]/.test(token)) throw new UnauthorizedException();
    try {
      const { userCustomer } = await this.customers.exec(new FindUserCustomerByTokenDtoIn(token));
      if (userCustomer.status !== 'active') throw new UnauthorizedException();
      const { client } = await this.clients.exec(new FindClientByUniqueIdDtoIn(userCustomer.clientId));
      if (client.status !== 'active' || !client.officeId) throw new UnauthorizedException();
      const { office } = await this.offices.exec(new FindOfficeByUniqueIdDtoIn(client.officeId));
      if (office.status !== 'active') throw new UnauthorizedException();
      // Identity proof only. This endpoint does not grant any business permission.
      return { officeId: office._id, clientId: client._id, userCustomerId: userCustomer._id };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof Error && ['user customer not found', 'client not found', 'office not found'].includes(error.message)) throw new UnauthorizedException();
      throw new ServiceUnavailableException('Identity service unavailable');
    }
  }
}
