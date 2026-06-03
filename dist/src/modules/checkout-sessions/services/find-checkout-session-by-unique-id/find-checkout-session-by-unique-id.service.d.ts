import type { ICheckoutSessionsRepository } from '../../entities/checkout-sessions-repository.interface';
import { FindCheckoutSessionByUniqueIdDtoIn } from './dtos/find-checkout-session-by-unique-id.dto-in';
import { FindCheckoutSessionByUniqueIdDtoOut } from './dtos/find-checkout-session-by-unique-id.dto-out';
export declare class FindCheckoutSessionByUniqueIdService {
    private readonly repository;
    constructor(repository: ICheckoutSessionsRepository);
    exec(dtoIn: FindCheckoutSessionByUniqueIdDtoIn): Promise<FindCheckoutSessionByUniqueIdDtoOut>;
}
