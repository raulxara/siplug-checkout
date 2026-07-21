import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { FindSubscriptionByExternalReferenceAndOfficeIdDtoIn } from './dtos/find-subscription-by-external-reference-and-office-id.dto-in';
import { FindSubscriptionByExternalReferenceAndOfficeIdDtoOut } from './dtos/find-subscription-by-external-reference-and-office-id.dto-out';
export declare class FindSubscriptionByExternalReferenceAndOfficeIdService {
    private readonly repository;
    constructor(repository: ISubscriptionsRepository);
    exec(dtoIn: FindSubscriptionByExternalReferenceAndOfficeIdDtoIn): Promise<FindSubscriptionByExternalReferenceAndOfficeIdDtoOut>;
}
