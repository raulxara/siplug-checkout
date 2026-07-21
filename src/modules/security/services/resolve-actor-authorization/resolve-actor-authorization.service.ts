import { Injectable } from '@nestjs/common';
import { FindUserCustomerByTokenDtoIn } from '../../../user-customers/services/find-user-customer-by-token/dtos/find-user-customer-by-token.dto-in';
import { FindUserCustomerByTokenService } from '../../../user-customers/services/find-user-customer-by-token/find-user-customer-by-token.service';
import { CheckUserPermissionDtoIn } from '../check-user-permission/dtos/check-user-permission.dto-in';
import { CheckUserPermissionService } from '../check-user-permission/check-user-permission.service';
import { ResolveActorAuthorizationDtoIn } from './dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationDtoOut } from './dtos/resolve-actor-authorization.dto-out';

@Injectable()
export class ResolveActorAuthorizationService {
  constructor(
    private readonly findUserCustomerByTokenService: FindUserCustomerByTokenService,
    private readonly checkUserPermissionService: CheckUserPermissionService,
  ) {}

  async exec(
    dtoIn: ResolveActorAuthorizationDtoIn,
  ): Promise<ResolveActorAuthorizationDtoOut> {
    try {
      const userCustomerDtoOut =
        await this.findUserCustomerByTokenService.exec(
          new FindUserCustomerByTokenDtoIn(dtoIn.token),
        );

      const actor = userCustomerDtoOut.userCustomer;

      if (actor.status !== 'active') {
        throw new Error('actor is not active');
      }

      const permissionDtoOut = await this.checkUserPermissionService.exec(
        new CheckUserPermissionDtoIn({
          userCustomerId: actor._id,
          requiredAction: dtoIn.requiredAction,
          requiredEntity: dtoIn.requiredEntity,
        }),
      );

      if (!permissionDtoOut.allowed) {
        throw new Error('actor does not have permission');
      }

      return new ResolveActorAuthorizationDtoOut(
        permissionDtoOut.allowed,
        permissionDtoOut.isAdministrator,
        dtoIn.requiredAction,
        dtoIn.requiredEntity,
        actor,
        permissionDtoOut.positions,
        permissionDtoOut.permissions,
        permissionDtoOut.matchedPermission,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on resolve actor authorization';

      throw new Error(message);
    }
  }
}